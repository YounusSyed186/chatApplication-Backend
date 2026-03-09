#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting all microservices...${NC}\n"

# Create a function to start a service
start_service() {
    local service_name=$1
    local service_path=$2
    local port=$3
    
    echo -e "${GREEN}Starting $service_name on port $port...${NC}"
    cd "$service_path" || exit 1
    npm install > /dev/null 2>&1
    npm start &
    sleep 2
}

# Get the base directory
BACKEND_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

# Start API Gateway
cd "$BACKEND_DIR/api-gateway" || exit 1
npm install > /dev/null 2>&1
echo -e "${GREEN}Starting API Gateway on port 3000...${NC}"
npm start &
sleep 2

# Start Auth Service
start_service "Auth Service" "$BACKEND_DIR/auth-service" 5000

# Start User Service
start_service "User Service" "$BACKEND_DIR/user-service" 5001

# Start Chat Service
start_service "Chat Service" "$BACKEND_DIR/chat-service" 5002

# Start Confession Service
start_service "Confession Service" "$BACKEND_DIR/confession-service" 5003

# Start Event Service
start_service "Event Service" "$BACKEND_DIR/event-service" 5004

# Start Matching Service
start_service "Matching Service" "$BACKEND_DIR/matching-service" 5005

# Start Moderation Service
start_service "Moderation Service" "$BACKEND_DIR/moderation-service" 5006

echo -e "\n${GREEN}All services started!${NC}"
echo -e "${YELLOW}API Gateway: http://localhost:3000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}\n"

# Wait for all background processes
wait
