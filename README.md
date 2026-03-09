# Chat Application Backend - Microservices Architecture

A comprehensive microservices-based backend for a chat application with user authentication, real-time messaging, confessions, events, and user matching.

## 📋 Project Structure

```
Backend/
├── api-gateway/              # Central API Gateway (Port 3000)
├── auth-service/             # Authentication Service (Port 5000)
├── user-service/             # User Management Service (Port 5001)
├── chat-service/             # Real-time Chat Service (Port 5002)
├── confession-service/       # Anonymous Confessions (Port 5003)
├── event-service/            # Event Management (Port 5004)
├── matching-service/         # User Matching Algorithm (Port 5005)
├── moderation-service/       # Content Moderation (Port 5006)
├── package.json              # Root package for managing all services
├── docker-compose.yml        # Docker container orchestration
├── start-services.sh         # Unix startup script
└── start-services.bat        # Windows startup script
```

## 🚀 Quick Start

### Option 1: Using npm scripts (Recommended)

```bash
# Install dependencies for all services
npm run install:all

# Start all services at once
npm run dev
```

### Option 2: Using shell script (Unix/Linux/Mac)

```bash
chmod +x start-services.sh
./start-services.sh
```

### Option 3: Using batch file (Windows)

```batch
start-services.bat
```

### Option 4: Start individual services

```bash
# Terminal 1 - API Gateway
npm run start:gateway

# Terminal 2 - Auth Service
npm run start:auth

# Terminal 3 - User Service
npm run start:user

# And so on for other services...
```

### Option 5: Using Docker

```bash
docker-compose up --build
```

## 📡 API Gateway

The API Gateway serves as the single entry point for all client requests and routes them to appropriate microservices.

**Base URL:** `http://localhost:3000`

### Available Endpoints

| Prefix | Service | Port |
|--------|---------|------|
| `/auth` | Authentication | 5000 |
| `/users` | User Management | 5001 |
| `/chat` | Chat & Messaging | 5002 |
| `/confessions` | Confessions | 5003 |
| `/events` | Events | 5004 |
| `/matching` | User Matching | 5005 |
| `/moderation` | Content Moderation | 5006 |

### Example Requests

```bash
# Health Check
curl http://localhost:3000/health

# Register User
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Get User Profile
curl http://localhost:3000/users/profile

# Get Events
curl http://localhost:3000/events
```

## 🔐 Auth Service (Port 5000)

Handles user authentication and authorization.

### Key Features
- User registration and login
- JWT token generation
- Password hashing with bcryptjs
- Session management

### Main Endpoints
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh-token` - Refresh JWT token

## 👥 User Service (Port 5001)

Manages user profiles and information.

### Key Features
- User profile CRUD operations
- User preferences and settings
- Embedding generation for user recommendations
- Profile search and filtering

### Main Endpoints
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `GET /all` - Get all users
- `GET /search` - Search users

## 💬 Chat Service (Port 5002)

Real-time messaging and chat rooms with Socket.io

### Key Features
- Real-time messaging with WebSocket
- Chat room management
- Message history
- User online/offline status
- Message models and room models

### Main Endpoints
- `GET /rooms` - Get all chat rooms
- `POST /rooms` - Create chat room
- `GET /messages/:roomId` - Get room messages
- WebSocket events for real-time communication

## 🤐 Confession Service (Port 5003)

Anonymous confessions with moderation.

### Key Features
- Anonymous confession posting
- Content moderation integration
- Auto-moderation for toxic content
- Confession history retrieval

### Main Endpoints
- `POST /` - Create confession
- `GET /` - Get confessions (paginated)
- `GET /:id` - Get specific confession
- `DELETE /:id` - Delete confession

## 📅 Event Service (Port 5004)

Event management and organization.

### Key Features
- Event CRUD operations
- Event categories
- Event search and filtering
- Attendance tracking
- Moderation check for event content

### Main Endpoints
- `POST /` - Create event
- `GET /` - Get all events
- `GET /:id` - Get event details
- `PUT /:id` - Update event
- `DELETE /:id` - Delete event
- `POST /:id/join` - Join event

## 🔗 Matching Service (Port 5005)

Intelligent user matching algorithm.

### Key Features
- Interest-based matching
- Embedding similarity matching
- Match recommendations
- Compatibility scoring

### Main Endpoints
- `POST /find-matches` - Find matching users
- `GET /matches` - Get user matches
- `POST /block-user` - Block user

## 🛡️ Moderation Service (Port 5006)

Content moderation and toxicity detection.

### Key Features
- Toxicity detection
- Content filtering
- Auto-moderation
- Moderation logs

### Main Endpoints
- `POST /moderate` - Moderate content
- `GET /logs` - Get moderation logs

## 🗄️ Database Configuration

### PostgreSQL
Used by: Auth, User, Confession, Event, Matching services
- **Connection:** `postgresql://postgres:younus098@localhost:5432/student_network`
- **Admin DB:** `postgresql://postgres:younus098@localhost:5432/auth_service`

### MongoDB
Used by: Chat service
- **Connection:** `mongodb+srv://younussyed1011_db_user:nph8Zme8SwkAidyD@cluster0.x9u8wqs.mongodb.net/`

## 📝 Environment Variables

Each service has a `.env` file with:
- `PORT` - Service port number
- `POSTGRES_URL` / `MONGO_URI` - Database connection
- `JWT_SECRET` - JWT signing secret (Auth service)
- `GEMINI_API_KEY` - Google Gemini API key
- `TOXICITY_MODEL_API_KEY` - Toxicity detection API key
- `MODERATION_SERVICE_URL` - Moderation service URL

## 🧹 Common Issues & Troubleshooting

### Port Already in Use
```bash
# Linux/Mac - Kill process on specific port
lsof -i :3000
kill -9 <PID>

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Services Not Communicating
- Ensure all services are running
- Check firewall settings
- Verify correct ports in API Gateway configuration
- Check service URLs in `.env` files

### Database Connection Issues
- Verify database is running
- Check connection strings in `.env` files
- Ensure credentials are correct
- For PostgreSQL: `psql -U postgres -h localhost`
- For MongoDB: Use MongoDB Compass or `mongosh`

### npm Install Fails
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🧪 Testing

Each service can be tested using the provided test files or Postman/Insomnia:

```bash
# Example test request
curl -v -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"pass123"}'
```

## 📚 Dependencies

### Core
- **Express.js** - Web framework
- **http-proxy-middleware** - API Gateway routing
- **Socket.io** - Real-time communication
- **Sequelize/Mongoose** - Database ORM

### Security
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token management
- **dotenv** - Environment configuration

### Utilities
- **CORS** - Cross-origin requests
- **nodemon** - Development auto-reload
- **concurrently** - Run multiple commands

## 🐳 Docker Deployment

### Build Images
```bash
docker-compose build
```

### Start Services
```bash
docker-compose up
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f [service-name]
```

## 📦 Deployment Checklist

- [ ] All environment variables configured
- [ ] Database connections tested
- [ ] API Gateway routing verified
- [ ] CORS settings appropriate for production
- [ ] SSL/TLS certificates configured (if needed)
- [ ] Load balancing configured
- [ ] Monitoring and logging set up
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Database backups scheduled

## 🤝 Contributing

1. Create a new branch for your feature
2. Make changes in the respective service directory
3. Test thoroughly before committing
4. Submit pull request with clear description

## 📄 License

ISC

## 📞 Support

For issues and questions, please refer to individual service README files.

---

**Last Updated:** March 2026
