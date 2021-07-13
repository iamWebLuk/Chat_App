# ChatApp - A Group Project for the Course Web Service Development SS21
David Riegler-Ulrike Ozim-Lukas Weber

## Overview

* Installation/Run
* Description
* Testing
* RabbitMQ
* Websocket
* Authorization
* Database
* Chatrooms
* Swearfilter
* Known Issues

### Installation/Run

Before you can start the programm you need some installations.

You need Nodes, RabbitMQ, and MongoDB.

[Node.js](https://nodejs.org/en/) \
[RabbitMQ](https://www.rabbitmq.com/download.html) \
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
 
[Windows](https://www.rabbitmq.com/install-windows.html) \
[Mac (Homebrew)](https://www.rabbitmq.com/install-homebrew.html) \
[Linux](https://www.rabbitmq.com/install-debian.html)

For Windows, I can recommend this video. It's  short and is on point. \
[Windows Youtube](https://www.youtube.com/watch?v=V9DWKbalbWQ)

To see if RabbitMQ is installed and running go to ```http://localhost:15672``` and ist should open a RabbitMQ Page. \
When everything is correctly installed you are now ready to start the project.

In the package.json file you have different scripts to start certain parts of the programm

Instead of starting your node server with npm start server.js just say:


   ```
    npm run start
   ```

With this command nodemon will observe your files and whenever something changes, it will gets automatically updated on your live server.
   ```
   npm run dev
   ```
   
This command is to start the jtests
  ```
  npm run test
  ```

 
<br><br>
Is everything done correctly you can use ```npm run start``` in the terminal and get this message:

![Verbindung](verbindung.png)


### Description

This application is a simple example for a chat program using express, socket.io, authorization, database and rabbitmq.

The user can log in via register the email and login with it.
The user can go in one of two chat rooms.
The user can send messages.
The user can use the route ```/logout``` to disconnect from the chat.
All users get messages and notifications for other users joining or leaving the chat.


## Imports

In our project there are a lot of imports. Here's a short explanation to every import for better understanding and why we added it \
I will skip the imports we did from methods from other classes of this project \
Flash is for rendering messages from the browser, for instance  to display when you entered a wrong password
```
const flash = require("express-flash");
```
This is a middleware function
```
const session = require("express-session");
```
methodOverride gives you PUT and DELETE at places where you normally shouldn't be allowed
```
const methodOverride = require("method-override");
```
Express is a minimalistic web framework from node
```
const express = require("express");
```
Bcrypt hash the password
```
const bcrypt = require("bcrypt");
```
Passport helps you at the authentication
```
const passport = require("passport");
```
Local password and username authentication
```
const LocalStrategy = require("passport-local").Strategy;
```
Import for the Mongo Database
```
const mongoose = require("mongoose");
```
The RabbitMQ middleware
```
const amqp = require("amqplib/callback_api");
```
The import for Socket.io
```
const io = require("socket.io")(http);
```


### Testing

```
npm test
```
The tests were taken from the [documentation](https://socket.io/docs/v4/testing/) of socket.io.
The tests provide only simple connection and message testing without the use of rabbitmq.
For functional testing two different browsers or incognito mode can be used.

### RabbitMQ

The application uses Message Queuing for the communication between the users.
We decided to use this Message Broker because, it was part of our Course at the University and is state-of-the-art
The protocol is AMQP and the exchange type is direct for a simpler overview.

Whenever a user is writing a message(producer), the message broker queues it into the message queue and then all the user in the same queue (consumers) are getting the messages one by one 

The Homepage of RabbitMQ has a good documentation about the functionality with graphics so take a look at it \
[Documentation](https://www.rabbitmq.com/getstarted.html)


### Websocket
 
  In this project we used websocket for the Chat. Because websocket is used for a two-way connection between the client and the server(bi-directional). So client and Server can   send Messages beetwen each other. The connection will be open as long, as one of these two drops off. \
 For this, we used the Javascript library Socket.io which is build for bi-directional communication between client and server.


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

First we started to store our user only locally in an array on your memory and are the array gets cleaned everytime the files get changed and you save your changes. When you don't do anything with your code, the programm runs as long as you want.

Then we implemented a database and saved all our users in the database.


Also the password is getting hashed with this function.

```
const hashedPassword = await bcrypt.hash(req.body.password, 10)
```

All it takes is the module brcypt, which automatically hashes your password

To logout and get to the login screen, simply put /logout in the url after localhost:3000. 


### Database

The database we choosed was MongoDB. It is a NoSQL database but a documentoriented, which means that you can manage JSON files in it.

To implement the node module in our project we had to implement it with

```
const mongoose = require("mongoose");
```

We used the database to store old messages, so when a user comes later to the party, he also gets the older messages


## Chatrooms

We have two different Chatrooms. Room1 and Room2 

![Chatroom](/media/ChatRoom.png)

Just select one of the two rooms and join your friends.
Like we said before, you can see all the other chat messages

To change the chatroom, change the URL from ```.../room=Room1``` to ```.../room=Room2```
When you want to disconnect from the server, simply put /logout behind the localhost:300 ```http://localhost:3000/logout```


## Swearfilter

We implemented a filter for some adult words. Whenever you say one of this 9 bad words, it gets replaced by ****
The blueprint gets implemented in the ```swearword-model.js```, the list of bad words is in the ```initialize-filter.js``` and the function in the ```db-controller.js```

## Known Issues

A too fast login after starting the program can cause an error. This can be eliminated by refresh the page. If you refresh your page in the chat, the client gets a disconnect and get a new connect afterwards. We tried ```var socket = io({ reconnection: false });``` but it doesn't seems to work
