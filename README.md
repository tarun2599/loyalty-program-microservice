# Loyalty Program Microservice

## Overview

This microservice is designed to handle user registrations, transactions, and balance management for a loyalty program. It supports earning and spending points, tracking transaction history, and provides an API documentation interface using Swagger.

## Features

- **User Registration**: Register new users with a unique ID.
- **Balance Management**: Check and update user balance.
- **Transaction Recording**: Record earning and spending transactions.
- **Transaction History**: Retrieve transaction history for a user.
- **Rate Limiting**: Protect against abuse with a rate limit of 50 requests per minute per IP.
- **Caching**: Improve performance with an in-memory cache.
- **Logging**: Track important events and errors.
- **Testing**: Unit and integration tests are included.
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

3. **Development Environment:**

    For development purposes, you can use `npm run dev` to run the application with hot-reloading:

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

4. **Production Environment:**

    For production, compile TypeScript to JavaScript and start the application:

    ```bash
    npm run build
    npm start
    ```

    The application will be available at `http://localhost:3000`.

### Testing

To run the included unit and integration tests:

```bash
npm test
