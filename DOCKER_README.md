# Belajar Islam - Docker Setup

This Docker Compose setup allows you to run the entire Belajar Islam application stack locally for testing purposes.

## Prerequisites

- Docker
- Docker Compose

## Services

The setup includes three services:

1. **MongoDB** - Database service (port 27017)
2. **Backend** - Ruby on Rails API (port 3000)
3. **Frontend** - Ionic React application (port 5173)

## Getting Started

1. Clone the repository and navigate to the project root:
   ```bash
   git clone <repository-url>
   cd belajar-islam
   ```

2. Build and start all services:
   ```bash
   docker compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - MongoDB: localhost:27017

## Available Commands

- **Start services**: `docker compose up`
- **Start services in background**: `docker compose up -d`
- **Build and start**: `docker compose up --build`
- **Stop services**: `docker compose down`
- **View logs**: `docker compose logs [service_name]`
- **Restart a service**: `docker compose restart [service_name]`

## Environment Variables

The setup uses the following environment variables which can be customized in the `docker-compose.yml` file:

### Backend
- `RAILS_ENV`: Rails environment (default: development)
- `MONGODB_HOST`: MongoDB hostname (default: mongodb)
- `MONGODB_PORT`: MongoDB port (default: 27017)
- `MONGODB_DATABASE`: Database name (default: backend_development)

### Frontend
- `NODE_ENV`: Node environment (default: production)
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

## Data Persistence

MongoDB data is persisted using Docker volumes. To reset the database, you can remove the volume:

```bash
docker compose down -v
```

## Troubleshooting

### Services won't start
- Make sure ports 3000, 5173, and 27017 are not in use
- Check logs with `docker compose logs [service_name]`

### Frontend can't connect to backend
- Verify the backend is running: `docker compose logs backend`
- Check if the API URL is correct in the browser network tab

### Database connection issues
- Ensure MongoDB service is running: `docker compose logs mongodb`
- Verify the backend can connect: `docker compose logs backend`

### SSL Certificate Issues During Build
If you encounter SSL certificate errors during the Docker build (particularly for the Ruby backend), you can:

1. **Try building with different SSL settings**:
   ```bash
   # Edit backend/Dockerfile and add before bundle install:
   # RUN bundle config set --global ssl_verify_mode 0
   ```

2. **Use host networking** (Linux only):
   ```bash
   docker compose build --build-arg http_proxy=$http_proxy --build-arg https_proxy=$https_proxy
   ```

3. **Build on host and copy** (alternative approach):
   ```bash
   # Run bundle install on host first, then build
   cd backend && bundle install
   cd .. && docker compose build
   ```

### Reset everything
```bash
docker compose down -v
docker compose build --no-cache
docker compose up
```

### Performance Notes
- The first build may take 10-15 minutes depending on your internet connection
- Subsequent builds will be faster due to Docker layer caching
- Consider using `docker compose up -d` to run in background