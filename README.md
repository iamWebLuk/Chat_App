# ChatApp - A Group Project for the Course Web Service Development SS21
David Riegler-Ulrike Ozim-Lukas Weber

##Overview

* Installation/Run
* Description
* Testing
* RabbitMQ
* Authorization
* Database
* Chatrooms


### Installation/Run

Before you can start the programm you need some installations.

You need Nodes, RabbitMQ, and MongoDB.

[Node.js](https://nodejs.org/en/)
[RabbitMQ](https://www.rabbitmq.com/download.html)
[MongoDB](https://www.mongodb.com)

You can install all the applications manuelly or via Node Package Manager(npm) in the terminal

To check if Node is correct installed, type

```
node -v
```

to check if Node Package Manager(npm) correct installed, type

```
npm -v
```

Get MongoDB via npm with:

```
npm i mongoose
```

To get RabbitMQ there are multiple ways depence on your system. 
[Windows](https://www.rabbitmq.com/install-windows.html)
[Mac (Homebrew)](https://www.rabbitmq.com/install-homebrew.html)
[Linux](https://www.rabbitmq.com/install-debian.html)

First get nodemon. This is a live server for node. Whenever you save any of your files, it automatically reloads your web project

```
npm i nodemon
```






in the package.json file you have different scripts to start certain parts of the programm

All what it does is to start the nodemon server. 

Instead of starting your node server with npm start server.js just say:


    ```
    npm run start
    ```
    
   Use this command to run the programm
    
    
    ```
    npm run dev
    ```
   
   With this command you watch your javascript and html files and whenever something changes, it will gets automatically updated on your live server
    
    
     ```
    npm run test
    ```

  This command is to start the jtests
  
  
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

```
<% if (messages.error) { %>
  <%= messages.error %>
<% } %>
```


Its an easy way to use Javascript inside your file. 

The user is only stored locally stored in an array on your memory and are the array gets cleaned everytime the files get changed and you save your changes. When you don't do anything with your code, the programm runs as long as you want.

Also the password is getting hashed with this function.

```
const hashedPassword = await bcrypt.hash(req.body.password, 10)
```

All it takes is the module brcypt, which automatically hashes your password


### Database

The database we choosed was MongoDB. It is a NoSQL database but a documentoriented, which means that you can manage JSON files in it.

To implement the node module in our project we had to implement it with

```
const mongoose = require("mongoose");
```

We used the database to store old messages, so when a user comes later to the party, he also gets the older messages


## Chatrooms

We have two different Chatrooms. Room1 and Room2 

![Chatroom](/media/chatroom)

Just select one of the two rooms and join your friends


