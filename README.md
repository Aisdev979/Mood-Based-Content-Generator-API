# **MoodFlow API: Personalized Content Recommendations**

<p align="center">
  <a href="https://github.com/Aisdev979/Mood-Based-Content-Generator-API">
    <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" alt="Node.js">
    <img src="https://img.shields.io/badge/Express.js-5.x-blue?logo=express" alt="Express.js">
    <img src="https://img.shields.io/badge/MongoDB-4.x%2B-green?logo=mongodb" alt="MongoDB">
    <img src="https://img.shields.io/badge/Mongoose-9.x-red?logo=mongoose" alt="Mongoose">
    <img src="https://img.shields.io/badge/JWT-Authentication-purple?logo=json-web-tokens" alt="JWT">
    <img src="https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?logo=swagger" alt="Swagger">
    <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  </a>
</p>

## Overview
The MoodFlow API is a robust Node.js Express.js backend system designed to deliver personalized content recommendations based on user mood. It integrates Mongoose for efficient MongoDB object data modeling, JWT for secure authentication, and a sophisticated recommendation engine to provide a highly tailored content experience.

## Features
-   **User Authentication & Authorization**: Secure user registration, login, and logout functionalities utilizing JSON Web Tokens (JWT) for session management, alongside role-based access control.
-   **Dynamic Mood Logging**: Enables users to log their daily mood, which subsequently informs the content recommendation engine.
-   **Intelligent Content Recommendations**: A powerful recommendation engine that suggests content tailored to the user's current mood, leveraging historical liked content and saved items for enhanced personalization.
-   **Content Submission & Moderation**: Provides functionality for users to submit new content, which enters a `pending` status awaiting approval.
-   **User Content Interaction**: Allows users to 'like' and 'save' content items, contributing to their personalized recommendation profile.
-   **Flexible Content Retrieval**: Endpoints to fetch content filtered by specific mood categories or to retrieve a random piece of approved content.
-   **Mood History Tracking**: Users can access a paginated history of their past mood logs for personal insights.
-   **Comprehensive API Documentation**: Built-in Swagger UI for interactive exploration and testing of all available API endpoints directly within the browser.

## Getting Started

To set up and run the MoodFlow API on your local development environment, please follow the instructions below.

### Installation
1.  **Clone the Repository**:
    First, retrieve the project source code from its GitHub repository:
    ```bash
    git clone https://github.com/Aisdev979/Mood-Based-Content-Generator-API.git
    cd Mood-Based-Content-Generator-API
    ```

2.  **Install Dependencies**:
    Navigate into the cloned project directory and install all necessary Node.js packages using npm:
    ```bash
    npm install
    ```

3.  **Start the Development Server**:
    Launch the API in development mode. The `nodemon` utility will automatically monitor for code changes and restart the server, streamlining the development workflow.
    ```bash
    npm run dev
    ```
    The API server will typically become accessible at `http://localhost:3000`.

### Environment Variables
The project utilizes environment variables for managing configurations such as port numbers, database connection strings, and security keys. Create a `.env` file in the root directory of the project and populate it with the following required variables:

```dotenv
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mood_content_db
JWT_SECRET=your_super_secret_jwt_key_here_please_make_it_long_and_complex
JWT_TOKEN_EXPIRESIN=7d
```

-   `PORT`: Specifies the TCP port number on which the Express server will listen for incoming requests.
-   `MONGODB_URI`: The connection string required to establish a connection to your MongoDB database instance.
-   `JWT_SECRET`: A critically important, strong, and unique secret key used for signing and verifying JSON Web Tokens, ensuring the integrity and authenticity of user sessions.
-   `JWT_TOKEN_EXPIRESIN`: Defines the duration after which an issued JWT token will expire (e.g., `7d` for seven days, `1h` for one hour, `30m` for thirty minutes).

## Usage

After successfully installing the dependencies and starting the server, you can interact with the MoodFlow API using various tools such as `curl`, Postman, or through the integrated Swagger UI documentation.

### Interactive API Documentation
For a comprehensive and interactive exploration of all available API endpoints, you can access the Swagger UI by navigating to:
`http://localhost:3000/api-docs`

This interface allows you to view endpoint details, send sample requests, and observe responses directly from your web browser.

### Authentication Flow
Most endpoints that interact with user-specific data require authentication. Follow these steps to authenticate your requests:
1.  **Sign Up**: Register a new user account by sending a POST request to the signup endpoint.
2.  **Sign In**: Log in with your registered credentials. The successful login response will include a JSON Web Token (JWT).
3.  **Authorize Subsequent Requests**: For all subsequent requests to protected endpoints, you must include the obtained JWT in the `Authorization` header. The format should be `Bearer YOUR_JWT_TOKEN`.

**Example: Logging a Mood**
To log an authenticated user's mood, you would execute a POST request similar to the following, ensuring to replace `YOUR_JWT_TOKEN` with your actual token:

```bash
curl -X POST \
  http://localhost:3000/api/v1/user/mood/log \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -d '{
    "mood": "happy",
    "date": "2023-11-01"
  }'
```

## API Documentation

### Base URL
The foundational URL prefix for all API endpoints in this service is: `http://localhost:3000/api/v1`

### Endpoints

#### POST /api/v1/auth/signup
Registers a new user account in the system.
**Request**:
```json
{
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "StrongPassword123"
}
```
**Response**:
```json
{
  "message": "User created successfully",
  "user": {
    "_id": "65b267c7e5a8d9a4b3c1d0e0",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "user",
    "createdAt": "2023-01-01T10:00:00.000Z",
    "updatedAt": "2023-01-01T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWIyNjdjN2U1YThkOWE0YjNjMWQwZTAiLCJpYXQiOjE2NzIyNjQ4MDAsImV4cCI6MTY3Mjk2MjQwMH0.signature"
}
```
**Errors**:
-   `400 Bad Request`: Indicates that a user with the provided email already exists.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### POST /api/v1/auth/signin
Authenticates a user with their credentials and issues a JWT token for subsequent requests.
**Request**:
```json
{
  "email": "john.doe@example.com",
  "password": "StrongPassword123"
}
```
**Response**:
```json
{
  "message": "Login successful",
  "user": {
    "_id": "65b267c7e5a8d9a4b3c1d0e0",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "user",
    "createdAt": "2023-01-01T10:00:00.000Z",
    "updatedAt": "2023-01-01T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWIyNjdjN2U1YThkOWE0YjNjMWQwZTAiLCJpYXQiOjE2NzIyNjQ4MDAsImV4cCI6MTY3Mjk2MjQwMH0.signature"
}
```
**Errors**:
-   `401 Unauthorized`: Denotes that the provided credentials (email or password) are invalid.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### POST /api/v1/auth/logout
Invalidates the current user's authentication token, effectively logging them out.
**Request**:
(No request body required)
**Response**:
```json
{
  "message": "Logged out successfully"
}
```
**Errors**:
-   `401 Unauthorized`: Returned if the provided access token is missing, expired, or invalid.

#### GET /api/v1/content/mood/{mood}
Retrieves a list of approved content items categorized under a specified mood.
**Request**:
(No request body required)
**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "65c3b1e7f8e0d1c2b3a4f5g6",
    "mood": ["happy"],
    "type": "quote",
    "content": "The best way to predict the future is to create it.",
    "status": "approved",
    "createdBy": "65b267c7e5a8d9a4b3c1d0e0",
    "likesCount": 15,
    "createdAt": "2023-01-05T12:30:00.000Z",
    "updatedAt": "2023-01-05T12:30:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Indicates that no approved content was found for the specified mood.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### GET /api/v1/content/random
Fetches a single, randomly selected approved content item.
**Request**:
(No request body required)
**Response**:
```json
{
  "success": true,
  "data": {
    "_id": "65c3b1e7f8e0d1c2b3a4f5g6",
    "mood": ["calm"],
    "type": "meditation",
    "content": "Take a deep breath and relax...",
    "status": "approved",
    "createdBy": "65b267c7e5a8d9a4b3c1d0e0",
    "likesCount": 8,
    "createdAt": "2023-01-10T08:00:00.000Z",
    "updatedAt": "2023-01-10T08:00:00.000Z"
  }
}
```
**Errors**:
-   `404 Not Found`: Indicates that no approved content is currently available in the database.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### POST /api/v1/content
Allows an authenticated user to submit new content for moderation. The submitted content will have a `pending` status.
*(Requires Authentication: `Bearer Token`)*
**Request**:
```json
{
  "mood": ["motivated"],
  "type": "inspiration",
  "content": "Believe you can and you're halfway there."
}
```
**Response**:
```json
{
  "success": true,
  "message": "Content submitted for approval",
  "data": {
    "mood": ["motivated"],
    "type": "inspiration",
    "content": "Believe you can and you're halfway there.",
    "status": "pending",
    "createdBy": "65b267c7e5a8d9a4b3c1d0e0",
    "_id": "65c3b1e7f8e0d1c2b3a4f5h7",
    "createdAt": "2023-01-15T14:45:00.000Z",
    "updatedAt": "2023-01-15T14:45:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Returned if `mood`, `type`, or `content` fields are missing or invalid in the request body.
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have the necessary permissions to submit content.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### POST /api/v1/content/{id}/like
Registers a 'like' from the authenticated user for a specified content item.
*(Requires Authentication: `Bearer Token`)*
**Request**:
(No request body required)
**Response**:
```json
{
  "message": "Content liked successfully",
  "data": {
    "_id": "65c3b1e7f8e0d1c2b3a4f5i8",
    "user": { "_id": "65b267c7e5a8d9a4b3c1d0e0", "username": "johndoe", "email": "john.doe@example.com", "role": "user" },
    "content": { "_id": "65c3b1e7f8e0d1c2b3a4f5g6", "mood": ["happy"], "type": "quote", "content": "...", "status": "approved", "likesCount": 16 },
    "createdAt": "2023-01-20T10:15:00.000Z",
    "updatedAt": "2023-01-20T10:15:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Denotes that the user has already liked this specific content item.
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to perform this action.
-   `404 Not Found`: Signifies that the content item with the provided ID does not exist.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### POST /api/v1/content/{id}/save
Adds a specified content item to the authenticated user's saved content list.
*(Requires Authentication: `Bearer Token`)*
**Request**:
(No request body required)
**Response**:
```json
{
  "message": "Content saved successfully",
  "data": {
    "_id": "65c3b1e7f8e0d1c2b3a4f5j9",
    "userId": { "_id": "65b267c7e5a8d9a4b3c1d0e0", "username": "johndoe", "email": "john.doe@example.com", "role": "user" },
    "contentId": { "_id": "65c3b1e7f8e0d1c2b3a4f5g6", "mood": ["happy"], "type": "quote", "content": "...", "status": "approved" },
    "createdAt": "2023-01-22T11:00:00.000Z",
    "updatedAt": "2023-01-22T11:00:00.000Z"
  }
}
```
**Errors**:
-   `400 Bad Request`: Indicates that the content item has already been saved by the user.
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to perform this action.
-   `404 Not Found`: Signifies that the content item with the provided ID does not exist.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### GET /api/v1/user/saved
Retrieves a list of all content items that have been saved by the authenticated user.
*(Requires Authentication: `Bearer Token`)*
**Request**:
(No request body required)
**Response**:
```json
[
  {
    "_id": "65c3b1e7f8e0d1c2b3a4f5j9",
    "userId": { "_id": "65b267c7e5a8d9a4b3c1d0e0", "username": "johndoe", "email": "john.doe@example.com", "role": "user" },
    "contentId": { "_id": "65c3b1e7f8e0d1c2b3a4f5g6", "mood": ["happy"], "type": "quote", "content": "...", "status": "approved" },
    "createdAt": "2023-01-22T11:00:00.000Z",
    "updatedAt": "2023-01-22T11:00:00.000Z"
  }
]
```
**Errors**:
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to access this resource.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### DELETE /api/v1/user/saved/{id}
Removes a specified content item from the authenticated user's saved content list.
*(Requires Authentication: `Bearer Token`)*
**Request**:
(No request body required)
**Response**:
```json
{
  "message": "Content removed"
}
```
**Errors**:
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to perform this action.
-   `404 Not Found`: Signifies that the content item with the provided ID does not exist or is not in the user's saved list.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### POST /api/v1/user/mood/log
Logs the authenticated user's mood for a given date and provides immediate content recommendations based on that mood.
*(Requires Authentication: `Bearer Token`)*
**Request**:
```json
{
  "mood": "happy",
  "date": "2023-01-25"
}
```
**Response**:
```json
{
  "success": true,
  "message": "Mood logged successfully",
  "data": {
    "moodLog": {
      "_id": "65c3b1e7f8e0d1c2b3a4f5k0",
      "user": "65b267c7e5a8d9a4b3c1d0e0",
      "mood": "happy",
      "date": "2023-01-25T00:00:00.000Z"
    },
    "recommendations": [
      {
        "_id": "65c3b1e7f8e0d1c2b3a4f5g6",
        "mood": ["happy"],
        "type": "quote",
        "content": "The best way to predict the future is to create it.",
        "status": "approved",
        "createdBy": "65b267c7e5a8d9a4b3c1d0e0",
        "likesCount": 15,
        "relevanceScore": 15
      }
    ]
  }
}
```
**Errors**:
-   `400 Bad Request`: Returned if `mood` is missing, invalid, or if the `date` is not a valid ISO 8601 string or is in the future.
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to perform this action.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### GET /api/v1/user/mood/history
Retrieves a paginated history of moods previously logged by the authenticated user.
*(Requires Authentication: `Bearer Token`)*
**Request**:
(Optional query parameters: `page` (default: 1), `limit` (default: 20) to control pagination)
```
GET /api/v1/user/mood/history?page=1&limit=5
```
**Response**:
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "65c3b1e7f8e0d1c2b3a4f5k0",
        "user": "65b267c7e5a8d9a4b3c1d0e0",
        "mood": "happy",
        "date": "2023-01-25T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 5,
      "totalPages": 1
    }
  }
}
```
**Errors**:
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to access this resource.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

#### GET /api/v1/recommendations/{mood}
Fetches content recommendations based on a specified mood without logging it as a user's mood.
*(Requires Authentication: `Bearer Token`)*
**Request**:
(Optional query parameter: `limit` (default: 10) to control the number of recommendations)
```
GET /api/v1/recommendations/happy?limit=3
```
**Response**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65c3b1e7f8e0d1c2b3a4f5g6",
      "mood": ["happy"],
      "type": "quote",
      "content": "The best way to predict the future is to create it.",
      "status": "approved",
      "createdBy": "65b267c7e5a8d9a4b3c1d0e0",
      "likesCount": 15,
      "relevanceScore": 15
    }
  ]
}
```
**Errors**:
-   `400 Bad Request`: Returned if the provided mood parameter is invalid.
-   `401 Unauthorized`: Occurs if the access token is missing, expired, or invalid.
-   `403 Forbidden`: Indicates that the authenticated user does not have permission to access this resource.
-   `500 Internal Server Error`: An unexpected server-side error occurred.

## Technologies Used

| Technology | Description |
| :--------- | :---------------------------------------------------------------------------------- |
| [Node.js](https://nodejs.org/en/) | A powerful JavaScript runtime environment for building scalable server-side applications. |
| [Express.js](https://expressjs.com/) | A fast, unopinionated, and minimalist web framework for Node.js. |
| [MongoDB](https://www.mongodb.com/) | A popular NoSQL document database, offering high performance and flexibility. |
| [Mongoose](https://mongoosejs.com/) | An elegant MongoDB object data modeling (ODM) library for Node.js. |
| [JSON Web Tokens (JWT)](https://jwt.io/) | A compact, URL-safe means of representing claims to be transferred between two parties. |
| [Bcrypt](https://www.npmjs.com/package/bcrypt) | A library designed for hashing passwords securely. |
| [CORS](https://expressjs.com/en/resources/middleware/cors.html) | An Express middleware to enable Cross-Origin Resource Sharing. |
| [Swagger UI Express](https://github.com/swagger-api/swagger-ui-express) | Middleware to serve auto-generated Swagger/OpenAPI documentation. |
| [Swagger JSDoc](https://github.com/Surnet/swagger-jsdoc) | Parses JSDoc-annotated source code and generates OpenAPI specifications. |
| [Dotenv](https://github.com/motdotla/dotenv) | A zero-dependency module that loads environment variables from a `.env` file. |
| [Nodemon](https://nodemon.io/) | A utility that automatically restarts the Node.js application when file changes are detected, enhancing development workflow. |

## Contributing

We wholeheartedly welcome and appreciate contributions to the MoodFlow API! If you are interested in helping improve this project, please follow these guidelines to ensure a smooth collaboration:

*   ✨ **Fork the repository**: Begin by creating your own copy of the project on GitHub.
*   🌿 **Create a new branch**: For each new feature or bug fix, create a dedicated branch with a descriptive name (e.g., `feature/add-mood-tracking`, `fix/login-bug`).
*   📝 **Make your changes**: Implement your enhancements, refactorings, or bug fixes with clean, readable code.
*   ✅ **Commit your changes**: Write clear, concise, and descriptive commit messages that explain the purpose of your changes.
*   ⬆️ **Push to your branch**: Upload your local changes to your forked repository.
*   ➡️ **Open a Pull Request**: Submit a pull request to the `main` branch of this repository, providing a detailed explanation of your changes and their benefits.

## Author Info

Connect with the primary contributor of this project:

-   **Aisdev979**
    -   [LinkedIn](https://linkedin.com/in/yourusername)
    -   [X (formerly Twitter)](https://x.com/yourusername)

---

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)