#!/bin/bash

# Quick start script for Belajar Islam Docker setup

echo "🚀 Starting Belajar Islam Docker setup..."

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker compose is available
if ! docker compose version >/dev/null 2>&1; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is running"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker compose down

# Build and start services
echo "🔨 Building and starting services..."
docker compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker compose ps

echo "🎉 Setup complete!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000"
echo "🗄️  MongoDB: localhost:27017"
echo ""
echo "📋 To view logs: docker compose logs [service_name]"
echo "🛑 To stop: docker compose down"
echo "🔄 To restart: docker compose restart [service_name]"