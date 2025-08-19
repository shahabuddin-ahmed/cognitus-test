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