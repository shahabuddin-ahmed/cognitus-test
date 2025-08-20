## Application Setup and Execution

1. Clone from git
```bash
git clone https://github.com/shahabuddin-ahmed/cognitus-test.git
```

2. Start Shared Infrastructure

#### Begin by launching the common services that all microservices depend on, such as databases and Kafka.

3. Navigate into the project directory
```bash
docker-compose -f docker-compose.infra.yml up -d
```

4. Start Each Microservice

Navigate to each service directory and start the respective service using its local Docker Compose file.

Auth Service (M1)
```bash
cd auth-service
docker-compose up -d
```

Campaign Service (M2)
```bash
cd ../campaign-service
docker-compose up -d
```

Email Service (M3)
```bash
cd ../email-service
docker-compose up -d
```

## Microservices Architecture: Auth, Campaign & Email Services

### Overview

This project demonstrates a microservices architecture comprising three services:
1. **Auth Service (M1):** Handles user authentication and authorization.
2. **Campaign Service (M2):** Manages marketing campaigns, including user targeting and campaign status.
3.	**Email Service (M3):** Processes promotional messages and logs email dispatch activities.

The services communicate asynchronously using Apache Kafka, facilitating a decoupled and scalable system.

### Architecture

#### Service Interactions
1.	**User Registration & Login:**
	* Users interact with the Auth Service for sign-up and login operations.
2.	**Campaign Management:**
	*	Authenticated users can create, list, and manage campaigns via the Campaign Service.
	*	Campaign publishing requests are authorized through the Auth Service and then forwarded to the Campaign Service.
3.	**Email Dispatch:**
	*	Upon campaign publication, the Campaign Service retrieves user data and publishes a promotional message to a Kafka topic.
	*	The Email Service consumes messages from the Kafka topic and processes email dispatches.
    *	Email dispatch activities are logged in the Email Service’s database.

#### Communication flow:
*   **User Registration & Login:** Handled by M1.
*   **Campaign Management:** Managed by M2, with authorization checks via M1.
*   **Email Dispatch:** Triggered by M2 publishing messages to Kafka; M3 consumes these messages and processes email dispatches.

### API Endpoints

#### Auth Service (M1)
	POST /auth/signup: Register a new user.
	POST /auth/login: Authenticate a user and obtain a JWT token.

#### Campaign Service (M2)
	POST /campaign/create: Create a new campaign.
	GET /campaign/list: Retrieve a list of campaigns.
	GET /campaign/{id}/details: Get details of a specific campaign.
	GET /campaign/{id}/status: Check the status of a campaign.
	POST /campaign/{id}/publish: Publish a campaign (requires authorization).

#### Email Service (M3)
	Kafka Consumer: Consumes messages from the emails Kafka topic and processes email dispatches.
	Database: Logs email dispatch activities in MongoDB.