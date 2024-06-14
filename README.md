# Discussion Platform

Welcome to the Discussion Platform! This project allows users to create discussions, comment on posts, like comments, and manage user accounts.

## Prerequisites

Before running the project locally, make sure you have the following installed:

- Docker
- Docker Compose (if using Docker Compose)

## Getting Started

Follow these steps to get the project up and running on your local machine using Docker:

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/RAWATSANCHIT/discussion-platform.git
cd discussion-platform
```

### 2. Build and Start Docker Containers

Using Docker Compose
If you have Docker Compose installed, you can build and start all services using a single command:

bash
docker-compose up --build

This command will build the Docker images for each service, create containers, and start them.


### 3. Access the Application
Once Docker containers are running, you can access the application in your web browser at:

Discussion Service: http://localhost:3001
User Service: http://localhost:3002
