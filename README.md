# Belajar Islam

A full-stack application for Islamic learning with a Ruby on Rails backend and Ionic React frontend.

## Architecture

- **Backend**: Ruby on Rails API with MongoDB
- **Frontend**: Ionic React with TypeScript  
- **Database**: MongoDB

## Quick Start with Docker 🐳

The easiest way to run the application locally:

```bash
# Clone the repository
git clone <repository-url>
cd belajar-islam

# Run the quick start script
./quick-start.sh
```

Or manually:

```bash
# Build and start all services
docker compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

📖 **For detailed Docker setup instructions, see [DOCKER_README.md](DOCKER_README.md)**

## Development Setup

### Backend (Rails)

```bash
cd backend
bundle install
rails server
```

### Frontend (Ionic React)

```bash
cd frontend
npm install
npm run dev
```

## Services

- **Frontend**: Ionic React app running on port 5173
- **Backend**: Rails API running on port 3000  
- **Database**: MongoDB running on port 27017

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request