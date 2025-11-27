# Event Ticket Booking System

A Node.js RESTful API for an event ticket booking system with concurrency handling and waitlist management.

## Features

*   **Initialize Event**: Create events with a specific number of tickets.
*   **Book Ticket**: Concurrent booking handling. Adds to waitlist if sold out.
*   **Cancel Booking**: Automatically promotes the next user from the waitlist.
*   **Event Status**: View available tickets and waitlist count.
*   **Concurrency**: Uses Database Transactions (`FOR UPDATE` locking) to ensure data integrity.

## Tech Stack

*   **Node.js** & **Express**
*   **SQLite3** (Persistence)
*   **TypeOrm** (Query Builder & Migrations)
*   **Jest** & **Supertest** (Testing)

## Setup & Running

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2
3.  **Start Server**:
    ```bash
    npm run start
    ```
    Server runs on `http://localhost:3000`.

## API Endpoints


### POST /auth/register
Register a new user.
```json
{
  "userName": "john_doe",
  "password": "secure_password"
}
```

### POST /events/initialize
Initialize a new event. requires basic auth
```json
{
  "name": "eventTribe",
  "availableTickets": 1
}
```

### POST tickets/book
Book a ticket. requires basic auth
```json

{
    "eventId": 1,
    "fullName": "femi"
}
```

### POST tickets/cancel
Cancel a booking.
```json
{
    "ticketId": 1,
    "fullName": "femi"
}
```

### GET events/status/:eventId
Get event status.

## Testing

Run unit and integration tests:
```bash
npm test
```
*Note: Ensure `NODE_ENV=test` is set if running manually, or use `npm test` which sets it.*

## Design Choices

*   **Database Transactions**: Used `database` to lock event rows during booking/cancellation to prevent race conditions.
*   **Waitlist Logic**: Implemented as a FIFO queue in the database.
*   **Architecture**: Controller-Service pattern (simplified to Controller for this size).
