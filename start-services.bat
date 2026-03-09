@echo off
REM Colors for output (using title)
title Starting Microservices...

echo Starting all microservices...
echo.

REM Get the base directory
cd /d %~dp0

REM Start API Gateway
echo Starting API Gateway on port 3000...
start cmd /k "cd api-gateway && npm install && npm start"
timeout /t 2 /nobreak

REM Start Auth Service
echo Starting Auth Service on port 5000...
start cmd /k "cd auth-service && npm install && npm start"
timeout /t 2 /nobreak

REM Start User Service
echo Starting User Service on port 5001...
start cmd /k "cd user-service && npm install && npm start"
timeout /t 2 /nobreak

REM Start Chat Service
echo Starting Chat Service on port 5002...
start cmd /k "cd chat-service && npm install && npm start"
timeout /t 2 /nobreak

REM Start Confession Service
echo Starting Confession Service on port 5003...
start cmd /k "cd confession-service && npm install && npm start"
timeout /t 2 /nobreak

REM Start Event Service
echo Starting Event Service on port 5004...
start cmd /k "cd event-service && npm install && npm start"
timeout /t 2 /nobreak

REM Start Matching Service
echo Starting Matching Service on port 5005...
start cmd /k "cd matching-service && npm install && npm start"
timeout /t 2 /nobreak

REM Start Moderation Service
echo Starting Moderation Service on port 5006...
start cmd /k "cd moderation-service && npm install && npm start"

echo.
echo All services started!
echo API Gateway: http://localhost:3000
echo Close these windows or press Ctrl+C in any window to stop services.
pause
