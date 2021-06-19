## ChatApp - A Group Project for the Course Web Service Development SS21
David Riegler-Ulrike Ozim-Lukas Weber

### Installation/Run

```
npm install
```

```
npm start
```

[RabbitMQ installation](https://www.rabbitmq.com/download.html)

### Description

This application is a simple example for a chat program using express, socket.io, auth0 and rabbitmq.

The user can log in via a form provided by auth0.
The user can send messages.
The user can use the route /logout to disconnect from the chat.
All users get messages and notifications for other users joining or leaving the chat.

### Testing

```
npm test
```
The tests were taken from the [documentation](https://socket.io/docs/v4/testing/) of socket.io.
The tests provide only simple connection and message testing without the use of rabbitmq.
For functional testing two different browsers or incognito mode can be used.

### RabbitMQ

The application uses Message Queuing for the communication between the users.
The protocol is AMQP and the exchange type is direct for a simpler overview.

### Authorization

The application uses openId-connect respectively [auth0](https://auth0.com/) for its user authorization.
A user can be created and Google or Github can be used to log in.
Because this application is only for demonstration purposes and for ease of use the app runs over http.
