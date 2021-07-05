## ChatApp - A Group Project for the Course Web Service Development SS21
David Riegler-Ulrike Ozim-Lukas Weber

### Installation/Run

```
npm install
```

You also need some other npm installs.

First get nodemon. This is a live server for node. Whenever you save any of your files, it automatically reloads your web project

```
npm i nodemon
```

in the package.json file you have a script called "devStart"
All what it does is to start the nodemon server. 

Instead of starting your node server with npm start server.js just say:

```
npm run devStart
```

This is all it should take to run the application.

Make sure to take a look in the .env.template file. Do what the instruction says there

[RabbitMQ installation](https://www.rabbitmq.com/download.html)

### Description

This application is a simple example for a chat program using express, socket.io, authorization and rabbitmq.

The user can log in via register the email and login with it.
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

The application has a basic html login and register window build with flash and 
For the authorization we used ejs instead of html files. ejs stands for Embedded Javascript which means, you can use Javascript code inside your HTML file. all it needs is this syntax. <%= XYZ >

e.g.
Taken out of the login.ejs file

<% if (messages.error) { %>
  <%= messages.error %>
<% } %>

Its an easy way to use Javascript inside your file. 

The user is only stored locally stored in an array on your memory and are the array gets cleaned everytime the files get changed and you save your changes. When you don't do anything with your code, the programm runs as long as you want.

Also the password is getting hashed with this function.

```
const hashedPassword = await bcrypt.hash(req.body.password, 10)
```

All it takes is the module brcypt, which automatically hashes your password