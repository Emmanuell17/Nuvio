const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get chat history between two users
router.get('/chat/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Verify the other user exists
    const userCheck = await pool.query(
      'SELECT id, username FROM users WHERE id = $1',
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get messages between the two users
    const result = await pool.query(
      `SELECT 
        m.id,
        m.content,
        m.message_type,
        m.is_read,
        m.created_at,
        m.sender_id,
        u.username as sender_username,
        u.avatar_url as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.created_at ASC`,
      [currentUserId, userId]
    );

    // Mark messages as read
    await pool.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false',
      [userId, currentUserId]
    );

    res.json({
      messages: result.rows,
      otherUser: userCheck.rows[0]
    });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recent conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const result = await pool.query(
      `SELECT DISTINCT ON (other_user.id)
        other_user.id,
        other_user.username,
        other_user.avatar_url,
        last_message.content as last_message,
        last_message.created_at as last_message_time,
        last_message.is_read,
        unread_count.count as unread_count
      FROM users other_user
      LEFT JOIN LATERAL (
        SELECT m.content, m.created_at, m.is_read
        FROM messages m
        WHERE (m.sender_id = $1 AND m.receiver_id = other_user.id)
           OR (m.sender_id = other_user.id AND m.receiver_id = $1)
        ORDER BY m.created_at DESC
        LIMIT 1
      ) last_message ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(*) as count
        FROM messages m
        WHERE m.sender_id = other_user.id 
          AND m.receiver_id = $1 
          AND m.is_read = false
      ) unread_count ON true
      WHERE other_user.id != $1
        AND last_message.content IS NOT NULL
      ORDER BY other_user.id, last_message.created_at DESC`,
      [currentUserId]
    );

    res.json({ conversations: result.rows });
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark messages as read
router.put('/read/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    await pool.query(
      'UPDATE messages SET is_read = true WHERE sender_id = $1 AND receiver_id = $2 AND is_read = false',
      [userId, currentUserId]
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get unread message count
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const result = await pool.query(
      `SELECT 
        sender_id,
        COUNT(*) as count
      FROM messages 
      WHERE receiver_id = $1 AND is_read = false
      GROUP BY sender_id`,
      [currentUserId]
    );

    const unreadCounts = {};
    result.rows.forEach(row => {
      unreadCounts[row.sender_id] = parseInt(row.count);
    });

    res.json({ unreadCounts });
  } catch (error) {
    console.error('Unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 