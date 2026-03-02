# WaveLine

A modern, real-time chat application built with Django (Backend) and React (Frontend) that enables seamless communication through WebSocket connections.

## Features

- **Real-time Messaging**: WebSocket-powered instant messaging with Django Channels
- **User Authentication**: JWT-based authentication system with registration and login
- **Chat Management**: Create and manage one-on-one conversations
- **Message Status**: Track message delivery status (sent, delivered, seen)
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Protected Routes**: Secure navigation with authentication guards

## Tech Stack

### Backend

- **Django 5.2.4** - Web framework
- **Django REST Framework** - API development
- **Django Channels** - WebSocket support for real-time communication
- **Django CORS Headers** - Cross-origin resource sharing
- **SimpleJWT** - JWT authentication
- **SQLite** - Database (development)

### Frontend

- **React 19.1.0** - UI library
- **Vite** - Build tool and development server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library

## Project Structure

```
WaveLine/
├── Backend/
│   ├── accounts/         # User authentication and management
│   ├── chats/            # Chat and message functionality
│   ├── core/             # Django project settings
│   ├── db.sqlite3        # Database file
│   ├── manage.py         # Django management script
│   └── requirements.txt  # Python dependencies
├── Frontend/
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   └── api.js        # API configuration
│   ├── package.json      # Node.js dependencies
│   └── vite.config.js    # Vite configuration
└── README.md
```

## Installation & Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/milanbairagi/WaveLine.git
   cd WaveLine/Backend
   ```

2. **Create and activate virtual environment**

   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Backend Environment (`backend/.env`)
   Create a `.env` file inside the `backend/` directory:

   ```ini
   DEBUG=True
   DJANGO_SECRET_KEY=your-secret-key-here

   PRODUCTION=False

   # Set PRODUCTION=True and DEBUG=False in production environment and update below settings accordingly
   # Optional fields during development
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
   DATABASE_URL=your_database_url_here (e.g., sqlite:///db.sqlite3 or postgres://user:password@host:port/dbname)
   REDIS_URL=your_redis_url_here (e.g., redis://localhost:6379/0)
   ```

   Replace `your-secret-key-here` with a secure random key. Generate one using:

   ```sh
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations**

   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**

   ```bash
   python manage.py createsuperuser
   ```

7. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd ../Frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. Frontend Environment (`frontend/.env`)
   Create a `.env` file inside the `frontend/` directory:

   ```ini
   VITE_API_URL=http://localhost:8000/api
   VITE_SOCKET_URL=ws://localhost:8000/ws
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/token/` - Login and get JWT tokens
- `POST /api/token/refresh/` - Refresh access token
- `GET /api/accounts/me/` - Get current user info
- `POST /api/accounts/register/` - Register new user

### Chats

- `GET /api/chats/` - List user's chats
- `POST /api/chats/` - Create new chat
- `GET /api/chats/{id}/messages/` - Get chat messages
- `POST /api/chats/{id}/messages/` - Send message

## WebSocket Connection

The application uses WebSocket for real-time messaging:

- **Connection URL**: `ws://127.0.0.1:8000/ws/chat/{chat_id}/`
- **Authentication**: JWT token required
- **Message Format**: JSON with sender, content, and timestamp

## Features Overview

### User Management

- User registration with username and password
- JWT-based authentication
- User profile with optional phone number

### Chat System

- One-on-one messaging
- Real-time message delivery
- Message status tracking
- Chat history persistence

### UI/UX

- Clean, modern interface
- Responsive design for all devices
- Dark/Light theme toggle
- Intuitive navigation

## Security Features

- JWT token-based authentication
- CORS configuration for cross-origin requests
- Protected API endpoints
- Client-side route protection
- Secure WebSocket connections

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Known Issues

- WebSocket connection may need reconnection handling in production
- File upload for media messages not yet implemented
- Group chat functionality is planned for future releases

## Future Enhancements

- [ ] Group chat support
- [ ] File and media sharing
- [ ] Message reactions and replies
- [ ] Online status indicators
- [ ] Push notifications
- [ ] Message encryption
- [ ] Voice and video calling
