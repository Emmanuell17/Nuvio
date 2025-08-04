# Nuvio - Real-time Chat App

A real-time mobile chat application built with React, Node.js, PostgreSQL, and Socket.io. Features include user authentication, real-time messaging, typing indicators, and mobile-responsive design.

## Features

- 🔐 **User Authentication**: Secure login and registration with JWT tokens
- 💬 **Real-time Messaging**: Instant message delivery using Socket.io
- 📱 **Mobile Responsive**: Optimized for mobile devices with touch-friendly interface
- 👥 **User Management**: View all users and start conversations
- 📝 **Typing Indicators**: See when someone is typing
- ✅ **Read Receipts**: Know when messages are read
- 🔍 **Search Users**: Find users quickly with search functionality
- 📊 **Conversation History**: View recent conversations and unread counts
- 🎨 **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Icons** - Beautiful icon library
- **CSS3** - Custom styling with mobile-first approach

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **PostgreSQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **pg** - PostgreSQL client

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

## Installation

1. **Clone the repository**
   ```bash
       git clone <repository-url>
    cd nuvio-chat-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create a new database
   createdb chat_app
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE chat_app;
   \q
   ```

4. **Configure environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your database credentials
   nano .env
   ```

   Update the `.env` file with your database configuration:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=chat_app
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

5. **Start the application**
   ```bash
   # Start both server and client in development mode
   npm run dev
   
   # Or start them separately:
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm run client
   ```

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`

2. **Register a new account** or **login** with existing credentials

3. **Start chatting**:
   - View all users in the "All Users" tab
   - Click on a user to start a conversation
   - Send messages in real-time
   - See typing indicators and read receipts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users

### Messages
- `GET /api/messages/chat/:userId` - Get chat history
- `GET /api/messages/conversations` - Get recent conversations
- `PUT /api/messages/read/:userId` - Mark messages as read
- `GET /api/messages/unread-count` - Get unread message counts

### Socket.io Events
- `authenticate` - Authenticate socket connection
- `private_message` - Send private message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `mark_read` - Mark messages as read

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  socket_id VARCHAR(255),
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Project Structure

```
nuvio-chat-app/
├── server/                 # Backend server
│   ├── config/            # Database configuration
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API routes
│   ├── socket/            # Socket.io handlers
│   └── index.js           # Server entry point
├── client/                # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── auth/      # Authentication components
│   │   │   ├── chat/      # Chat components
│   │   │   ├── layout/    # Layout components
│   │   │   └── profile/   # Profile components
│   │   ├── contexts/      # React contexts
│   │   ├── App.js         # Main app component
│   │   └── index.js       # App entry point
│   └── package.json
├── package.json           # Root package.json
├── .env                   # Environment variables
└── README.md
```

## Development

### Running in Development Mode
```bash
npm run dev
```

### Building for Production
```bash
# Build the React app
npm run build

# Start production server
npm start
```

### Database Migrations
The database tables are automatically created when the server starts for the first time.

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **CORS Protection** - Configured CORS for security
- **Rate Limiting** - API rate limiting to prevent abuse
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Parameterized queries

## Mobile Optimization

- **Responsive Design** - Mobile-first approach
- **Touch-Friendly** - Optimized for touch interactions
- **Fast Loading** - Optimized bundle size and lazy loading
- **Offline Support** - Graceful handling of network issues
- **PWA Ready** - Can be installed as a Progressive Web App

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Include your Node.js version, PostgreSQL version, and error logs

## Acknowledgments

- Socket.io for real-time communication
- React team for the amazing framework
- PostgreSQL for the reliable database
- The open-source community for inspiration and tools 