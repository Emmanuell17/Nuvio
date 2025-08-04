const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Store connected users
const connectedUsers = new Map();

const handleSocketConnection = (socket, io) => {
  console.log('New socket connection:', socket.id);

  // Authenticate user
  socket.on('authenticate', async (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verify user exists
      const result = await pool.query(
        'SELECT id, username, avatar_url FROM users WHERE id = $1',
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        socket.emit('auth_error', { message: 'User not found' });
        return;
      }

      const user = result.rows[0];
      
      // Store user connection
      connectedUsers.set(socket.id, {
        userId: user.id,
        username: user.username,
        avatar_url: user.avatar_url
      });

      // Update user session in database
      try {
        await pool.query(
          `INSERT INTO user_sessions (user_id, socket_id, is_online, last_seen)
           VALUES ($1, $2, true, CURRENT_TIMESTAMP)
           ON CONFLICT (user_id) 
           DO UPDATE SET 
             socket_id = $2, 
             is_online = true, 
             last_seen = CURRENT_TIMESTAMP`,
          [user.id, socket.id]
        );
      } catch (error) {
        // If ON CONFLICT fails, try a simple update
        await pool.query(
          `UPDATE user_sessions 
           SET socket_id = $2, is_online = true, last_seen = CURRENT_TIMESTAMP 
           WHERE user_id = $1`,
          [user.id, socket.id]
        );
      }

      socket.userId = user.id;
      socket.username = user.username;
      
      // Join user to their personal room
      socket.join(`user_${user.id}`);
      
      socket.emit('authenticated', { 
        message: 'Authentication successful',
        user: {
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url
        }
      });

      // Broadcast user online status
      socket.broadcast.emit('user_online', {
        userId: user.id,
        username: user.username
      });

      console.log(`User ${user.username} authenticated and connected`);
    } catch (error) {
      console.error('Socket authentication error:', error);
      socket.emit('auth_error', { message: 'Authentication failed' });
    }
  });

  // Handle private messages
  socket.on('private_message', async (data) => {
    try {
      const { receiverId, content, messageType = 'text' } = data;
      
      if (!socket.userId) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      // Save message to database
      const result = await pool.query(
        `INSERT INTO messages (sender_id, receiver_id, content, message_type)
         VALUES ($1, $2, $3, $4)
         RETURNING id, created_at`,
        [socket.userId, receiverId, content, messageType]
      );

      const message = {
        id: result.rows[0].id,
        content,
        message_type: messageType,
        sender_id: socket.userId,
        sender_username: socket.username,
        created_at: result.rows[0].created_at,
        is_read: false
      };

      // Send to receiver if online
      const receiverSocket = Array.from(connectedUsers.entries())
        .find(([_, user]) => user.userId === receiverId);

      if (receiverSocket) {
        io.to(receiverSocket[0]).emit('new_message', message);
      }

      // Send confirmation to sender
      socket.emit('message_sent', message);

      console.log(`Message sent from ${socket.username} to user ${receiverId}`);
    } catch (error) {
      console.error('Message sending error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { receiverId } = data;
    if (socket.userId) {
      const receiverSocket = Array.from(connectedUsers.entries())
        .find(([_, user]) => user.userId === receiverId);
      
      if (receiverSocket) {
        io.to(receiverSocket[0]).emit('user_typing', {
          userId: socket.userId,
          username: socket.username
        });
      }
    }
  });

  socket.on('typing_stop', (data) => {
    const { receiverId } = data;
    if (socket.userId) {
      const receiverSocket = Array.from(connectedUsers.entries())
        .find(([_, user]) => user.userId === receiverId);
      
      if (receiverSocket) {
        io.to(receiverSocket[0]).emit('user_stopped_typing', {
          userId: socket.userId
        });
      }
    }
  });

  // Handle read receipts
  socket.on('mark_read', async (data) => {
    try {
      const { senderId } = data;
      
      if (!socket.userId) return;

      // Update messages as read in database
      await pool.query(
        'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false',
        [senderId, socket.userId]
      );

      // Notify sender that messages were read
      const senderSocket = Array.from(connectedUsers.entries())
        .find(([_, user]) => user.userId === senderId);

      if (senderSocket) {
        io.to(senderSocket[0]).emit('messages_read', {
          readerId: socket.userId,
          readerUsername: socket.username
        });
      }
    } catch (error) {
      console.error('Mark read error:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('Socket disconnected:', socket.id);
    
    const user = connectedUsers.get(socket.id);
    if (user) {
      try {
        // Update user session in database
        await pool.query(
          `UPDATE user_sessions 
           SET is_online = false, last_seen = CURRENT_TIMESTAMP 
           WHERE user_id = $1`,
          [user.userId]
        );
      } catch (error) {
        console.error('Error updating user session on disconnect:', error);
      }

      // Remove from connected users
      connectedUsers.delete(socket.id);

      // Broadcast user offline status
      socket.broadcast.emit('user_offline', {
        userId: user.userId,
        username: user.username
      });

      console.log(`User ${user.username} disconnected`);
    }
  });
};

module.exports = { handleSocketConnection }; 