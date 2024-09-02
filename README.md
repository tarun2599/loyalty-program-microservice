# Loyalty Program Microservice

## Overview

This microservice is designed to handle user registrations, transactions, and balance management for a loyalty program. It supports earning and spending points, tracking transaction history, and provides an API documentation interface using Swagger.

## Features

- **User Registration**: Register new users with a unique ID.
- **Balance Management**: Check and update user balance.
- **Transaction Recording**: Record earning and spending transactions.
- **Transaction History**: Retrieve transaction history for a user.
- **Rate Limiting**: Protect against abuse with basic rate limiting.
- **Caching**: Improve performance with an in-memory cache.
- **Logging**: Track important events and errors.
- **Docker Support**: Containerize the application for easy deployment.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Docker (optional, if using Docker)

### Installation

#### Via Docker

1. **Pull the Docker Image:**

    ```bash
    docker pull hello2599/loyalty-program-microservice:latest
    ```

2. **Run the Docker Container:**

    ```bash
    docker run -p 3000:3000 --name loyalty-program-microservice hello2599/loyalty-program-microservice:latest
    ```

    The application will be available at `http://localhost:3000`.

#### Manual Setup

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/tarun2599/loyalty-program-microservice.git
    cd loyalty-program-microservice
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Compile TypeScript to JavaScript:**

    ```bash
    npm run build
    ```

4. **Start the Application:**

    ```bash
    npm start
    ```

    The application will be available at `http://localhost:3000`.

### API Documentation

The API documentation is available at `/api-docs` once the server is running. You can explore and test the API endpoints through the Swagger UI.

## Directory Structure

- `src/`: Contains the source code.
  - `controllers/`: Controller logic for handling requests.
  - `middleware/`: Middleware functions for rate limiting and logging.
  - `models/`: Database interaction and data models.
  - `routes/`: API route definitions.
  - `utils/`: Utility functions like caching and logging.
- `tests/`: Test files for unit and integration testing.
- `Dockerfile`: Docker configuration for containerizing the application.
- `swagger.yaml`: Swagger configuration for API documentation.
- `package.json`: Node.js project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.

## Dockerfile

The Dockerfile builds an image with Node.js and your application code. To build the Docker image:

```bash
docker build -t hello2599/loyalty-program-microservice:latest .
