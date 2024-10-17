Here’s the correct markdown format for your `README.md` file. You can save this as `README.md` in your project directory.

# AI Quizzer API

This is a Node.js server that provides an AI-powered quiz generation and evaluation system. It allows users to authenticate, generate quizzes, submit answers, view their quiz history, retry quizzes, and retrieve hints for specific questions.

Implemented RATE_LIMITING for Limited access to the server.

Used AWS Amazon Elastic Registry(for Docker image repositories) and EC2 to deploy this application.

Redis is utilized for caching, which significantly reduces latency during quiz generation and evaluation processes. 

Upon submitting their responses, users receive an EMAIL with personalized suggestions for improvement, fostering a more engaging and supportive learning experience.

Used JWT tokens for authentication.

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) v14.x or above
- [MongoDB](https://www.mongodb.com/) (for data storage)
- [Redis](https://redis.io/) (for caching, optional)
- [Docker](https://www.docker.com/) (optional, if running in a container)




## Installation

Install the dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
NODE_ENV
PORT
MONGODB_URI
JWT_SECRET
JWT_EXPIRATION
GROQ_API_KEY
GROQ_API_URL
REDIS_URL
REDIS_PASSWORD
REDIS_PORT
EMAIL_SERVICE
EMAIL_USERNAME
EMAIL_PASSWORD
LOG_LEVEL
RATE_LIMIT_WINDOW_MS
RATE_LIMIT_MAX
CORS_ORIGIN
SESSION_SECRET
API_VERSION
```

## Running the Server

To run the server :

```bash
npm start
```
## API Documentation

The API documentation is available via Swagger UI. Once the server is running, you can access the documentation at the root path /.

Swagger UI is automatically generated based on the OpenAPI specification defined in the project.
## API Endpoints

### Authentication
#### **POST** `/api/v1/auth/register`

Mock user authentication. Register a user by providing an email and password.

- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```



### Quiz Generation
#### **POST** `/api/v1/quiz/generate`

Generate a quiz by providing quiz details like grade, subject, number of questions, etc.

- **Request Body**:
  ```json
  {
    "grade": 10,
    "subject": "Mathematics",
    "totalQuestions": 5,
    "maxScore": 100,
    "difficulty": "MEDIUM"
  }
  ```



### Quiz Submission
#### **POST** `/api/v1/quiz/submit`

Submit quiz answers after completing a quiz.

- **Request Body**:
  ```json
  {
    "quizId": "quiz-id",
    "responses": [
      {
        "questionId": "question-id",
        "userResponse": "Answer text"
      }
    ]
  }
  ```
This will return Score of the quiz and Also Send it in Mail with suggestions


### Quiz History
#### **GET** `/api/v1/quiz/history`

Retrieve quiz history with optional filtering by grade, subject, score range, and date.

- **Query Parameters**:
  - `grade`: (optional) Filter by grade.
  - `subject`: (optional) Filter by subject.
  - `minScore`: (optional) Minimum score.
  - `maxScore`: (optional) Maximum score.
  - `from`: (optional) Start date (YYYY-MM-DD).
  - `to`: (optional) End date (YYYY-MM-DD).


### Retry Quiz
#### **POST** `/api/v1/quiz/{quizId}/retry`

Retry a previously completed quiz.

- **Path Parameters**:
  - `quizId`: The ID of the quiz to retry.



### Get Question Hint
#### **GET** `/api/v1/quiz/{quizId}/question/{questionId}/hint`

Retrieve a hint for a specific question in a quiz.

- **Path Parameters**:
  - `quizId`: The ID of the quiz.
  - `questionId`: The ID of the question.

### Get Question Hint
#### **GET** `/api/v1/quiz/{quizId}/getSubmissionOfQuiz


Get Previous Sumbission of specific quiz by Quiz ID

- **Path Parameters**:
  - `quizId`: The ID of the quiz.



## Security

This API uses JWT (JSON Web Token) for securing endpoints. Include the token in the `Authorization` header for all protected routes.

- Example Authorization Header:

  ```bash
  Authorization: Bearer your-jwt-token
  ```
