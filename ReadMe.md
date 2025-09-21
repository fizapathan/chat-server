# Mock Chat Server made with NodeJS, Express, and Socket.IO

This chat server covers both the REST APIs and WebSocket protocols for communication.

1. REST API
   - The REST API allows clients to interact with the server using standard HTTP methods.
   - Endpoints are available for user authentication, fetching all users, message retrieval, and other chat functionalities.
   - Responses are typically in JSON format.

2. WebSocket
   - WebSocket provides a full-duplex communication channel over a single, long-lived connection.
   - This is ideal for real-time chat applications where low latency is crucial.
   - Clients can subscribe to specific events and receive updates instantly.

## Getting Started
   - Install the required dependencies: `npm install` 
   - Start the server with `npm start`.

## Note
   - **No database** is integrated in this implementation. Ideal storage for a chat application would be a NoSQL database like MongoDB.
   - This project is a basic implementation and doesn't include features such as error handling, security measures, and scalability considerations for production use.