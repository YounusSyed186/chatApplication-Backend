# API Gateway

Central API Gateway for managing all microservices in the Chat Application Backend.

## Overview

The API Gateway routes incoming requests to different microservices based on the URL path. This provides a single entry point for all client requests.

## Architecture

```
Client Requests
      ↓
   API Gateway (Port 3000)
    ↙ ↓ ↓ ↓ ↓ ↓ ↓ ↘
   ┌─────────────────────────────────────────┐
   │  Auth        User      Chat         │
   │  (5000)      (5001)    (5002)       │
   │                                     │
   │  Confession  Event     Matching     │
   │  (5003)      (5004)    (5005)       │
   │                                     │
   │  Moderation                          │
   │  (5006)                              │
   └─────────────────────────────────────────┘
```

## Service Routes

| Service | Endpoint | Port | Description |
|---------|----------|------|-------------|
| Auth | `/auth` | 5000 | User authentication & authorization |
| User | `/users` | 5001 | User profile management |
| Chat | `/chat` | 5002 | Real-time messaging & chat rooms |
| Confession | `/confessions` | 5003 | Anonymous confessions |
| Event | `/events` | 5004 | Event management |
| Matching | `/matching` | 5005 | User matching algorithm |
| Moderation | `/moderation` | 5006 | Content moderation |

## Installation

```bash
cd api-gateway
npm install
```

## Running the Gateway

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The API Gateway will be available at `http://localhost:3000`

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

# Microservices Ports
AUTH_SERVICE_PORT=5000
USER_SERVICE_PORT=5001
CHAT_SERVICE_PORT=5002
CONFESSION_SERVICE_PORT=5003
EVENT_SERVICE_PORT=5004
MATCHING_SERVICE_PORT=5005
MODERATION_SERVICE_PORT=5006
```

## Example Requests

### Health Check
```bash
curl http://localhost:3000/health
```

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Get User Profile
```bash
curl http://localhost:3000/users/profile
```

### Get Available Events
```bash
curl http://localhost:3000/events
```

## Running All Services

To run all services together, use the provided startup script:

### Linux/Mac
```bash
./start-services.sh
```

### Windows
```bash
start-services.bat
```

Or use npm (requires concurrently):
```bash
npm install concurrently -g
npm run dev:all
```

## Error Handling

The API Gateway handles service unavailability gracefully:

- Returns `503 Service Unavailable` if a microservice is down
- Returns `404 Not Found` for unknown routes
- Returns `400-500` status codes based on service responses

## CORS Configuration

CORS is enabled for all origins. Modify in `src/app.js` if needed:

```javascript
app.use(cors({
  origin: 'http://localhost:3001', // Specify client origin
  credentials: true
}));
```

## Monitoring

Monitor logs from each service terminal to debug issues:

```bash
# Terminal 1
npm start

# Terminal 2 (in each service directory)
# auth-service
npm start

# Terminal 3
# user-service
npm start

# And so on...
```

## Troubleshooting

### "Service Unavailable" Error
- Ensure all microservices are running on their designated ports
- Check if services are listening correctly: `lsof -i :5000` (for port 5000)

### CORS Issues
- Check if client origin is allowed in API Gateway settings
- Verify proxy headers are correctly forwarded

### Port Conflicts
- Kill any existing processes: `lsof -i :3000` then `kill -9 <PID>`

## License

ISC
