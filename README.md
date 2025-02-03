# URL Shortener API

A **URL Shortener API** built with **NestJS**, **MongoDB** (via Mongoose), and **Base62** encoding. The API shortens long URLs, dynamically redirects to the original URL, implements rate limiting, and tracks visitor counts.

- [URL Shortener API](#url-shortener-api)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
    - [Shorten URL](#shorten-url)
    - [Redirect URL](#redirect-url)
  - [Rate Limiting](#rate-limiting)
  - [Visitor Count Tracking](#visitor-count-tracking)
  - [Testing](#testing)
  - [Project Structure](#project-structure)
  - [License](#license)

## Features

- **URL Shortening:** Generates a shortened URL using a Base62 encoded MongoDB ObjectId.
- **Dynamic Redirection:** Redirects requests from the shortened URL to the original URL.
- **Visitor Count Tracking:** Increments and tracks the number of visitors for each short URL.
- **Rate Limiting:** Prevents abuse by limiting requests per IP using NestJS's throttler module.

## Technologies Used

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- [@nestjs/throttler](https://docs.nestjs.com/security/rate-limiting) for rate limiting
- TypeScript
- [Base62 Encoding](https://en.wikipedia.org/wiki/Base62)

## Getting Started

### Prerequisites

- Node.js (>= 20)
- MongoDB (local installation or Atlas)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. **Copy the Environment Example File:**

   Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

4. **Run the Application:**

   - For development:
     ```bash
     npm run start:dev
     ```
   - For production:
     ```bash
     npm run build
     npm run start:prod
     ```

The API will be available at `http://localhost:3000` (or on the port specified in your `.env` file).

## API Endpoints

### Shorten URL

- **POST /**  
  **Description:** Accepts a JSON body with a key `url` containing the original URL.
  **Example Request Body:**
  ```json
  {
    "url": "https://example.com"
  }
  ```
  **Response:**
  ```json
  "http://localhost:3000/abcd12"
  ```

### Redirect URL

- **GET /:shortUrl**  
  **Description:** Redirects to the original URL corresponding to the given short URL segment.
  - Returns a **302 redirect** to the original URL if found.
  - Returns a **404 Not Found** error if the short URL is invalid.

## Rate Limiting

This project uses **@nestjs/throttler** to limit API requests to 10 per minute per IP. This is configured globally in the application module.

## Visitor Count Tracking

Each time a short URL is accessed via the GET endpoint, the visitor count is incremented in the database. This helps track usage analytics.

## Testing

The project includes unit tests written with Jest. To run tests:

```bash
npm test
```

Tests cover:
- URL shortening and full URL response formatting.
- Dynamic redirection with visitor count increment.
- Rate limiting (disabled during tests via guard override).

## Project Structure

```
url-shortener/
├── src/
│   ├── app.controller.ts      // URL shortening & redirection endpoints
│   ├── app.controller.spec.ts // Controller tests
│   ├── app.service.ts         // Business logic for URL operations
│   ├── app.schema.ts          // Mongoose schema for URL documents
│   ├── env.ts                 // Environment configuration
│   └── base62.ts              // Base62 encoding/decoding utility functions
├── .env.example               // Environment variables example
├── .env                       // Environment variables (generated from .env.example)
├── package.json
├── tsconfig.json
└── README.md
```

## License

Distributed under the MIT License. See `LICENSE` for details.
