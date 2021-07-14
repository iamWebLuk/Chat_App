# ChatApp - A Group Project for the Course Web Service Development SS21

### Authors
* [David Riegler](https://github.com/RegalFenster)
* [Ulrike Ozim](https://github.com/UlrikeOzim)
* [Lukas Weber](https://github.com/iamWebLuk)

## Overview

* Installation/Run
* Description
* Config Folder
* Testing
* RabbitMQ
* Websocket
* Authorization
* Database
* Chatrooms
* Swearfilter
* Known Issues

### Installation/Run

Before you can start the program you need some installations.

You need Nodes, RabbitMQ, and MongoDB.

[Node.js](https://nodejs.org/en/)
[RabbitMQ](https://www.rabbitmq.com/download.html)
[MongoDB](https://www.mongodb.com)

You can install all the applications manually or via Node Package Manager(npm) in the terminal

To check if Node is correct installed, type

```
node -v
```

to check if Node Package Manager(npm) is correctly installed, type

```
npm -v
```

Get MongoDB via npm with:

```
npm i mongoose
```

To get RabbitMQ there are multiple ways dependent on your system.
 
[Windows](https://www.rabbitmq.com/install-windows.html) \
[Mac (Homebrew)](https://www.rabbitmq.com/install-homebrew.html) \
[Linux](https://www.rabbitmq.com/install-debian.html)

For Windows, I can recommend this video. It's  short and on point. \
[Windows Youtube](https://www.youtube.com/watch?v=V9DWKbalbWQ)

To see if RabbitMQ is installed and running go to ```http://localhost:15672``` and ist should open a RabbitMQ Page.

As last step ```create a folder called config and in this folder put the config file```

When everything is correctly installed you are now ready to start the project.

In the package.json file you have different scripts to start certain parts of the programm

Instead of starting your node server with npm start server.js just say:


   ```
    npm run start
   ```

With this command nodemon will observe your files and whenever something changes, it will automatically restart the live server.
   ```
   npm run dev
   ```
   
This command is to start the tests
  ```
  npm run test
  ```


 
<br><br>

If everything is done correctly you can use ```npm run start``` in the terminal and get this message:

![Verbindung](/media/verbindung.png)


### Description

This application is a simple example for a chat program using express, socket.io, authorization, database and rabbitmq.
Our project is running on ```localhost:3000```

The user can log in via register the email and login with it.
The user can set or join a room.
The user can see older messages from this room.
The user can send messages.
The user can use the route ```/logout``` to disconnect from the chat.
All users get messages and notifications for other users joining or leaving the chat.


## Config File

There are some critical configurations that should never be shown to the public or be in a repository, like passwords, keys etc..
Always save the file locally on your computer or laptop. The .gitignore file will handle that it won't get pushed to the github repo.
When you clone the repository, create a folder called config and in this folder put the config file.

## Imports

In our project there are a lot of imports. Here's a short explanation to every import for better understanding and also the reason we added it

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

The tests were written with jest.

At first we had some standard tests from the socket.io [documentation](https://socket.io/docs/v4/testing/).
The tests provide only simple connection and message testing without the use of rabbitmq.
For functional testing two different browsers or incognito mode can be used.

Then we started to write some tests for the GET paths of the authorization, but didn't have enough time to do this well. This isn't and shouldn't be an excuse, because testing is a major part of software engineering. Some of our tests include the login, register, logout and so on. If we had more time, we could have done better or more tests.


### RabbitMQ

The application uses Message Queuing for the communication between the users.
We decided to use this Message Broker because it was part of our course at the University and it's state-of-the-art.
The protocol is AMQP and we used an exchange that serves two queues with messages. The first queue is for unfiltered messages
and the second for filtered messages.

![MQ](/media/mq.png) \
&copy; Harald Schwab
<br><br><br>
Whenever a user is writing a message (producer), the message broker queues it into the message queue and then all the users in the same queue (consumers) are getting the messages one by one.

The Homepage of RabbitMQ has a good documentation about the functionality with graphics so take a look at it
[Documentation](https://www.rabbitmq.com/getstarted.html)


### Websocket
 
  In this project we used websocket for the chat because websockets enable two-way connections between client and server. So client and server can send messages between each other.
 For this, we used the javascript library socket.io which is built for bi-directional communication between client and server.
 You can see the implementation of websockets in the chat per se. When a user connects or disconnects you get a message and on the top right side of the chat, you see all the current users.
 
 The idea or rather the advantage of websockets is that the client doesn't have to ask the server every 5 seconds by sending a new http request if there is a new message or on the other side the server doesn't need to send new data every few seconds .
 
 <b>That is not a real time connection!</b>

It's like an open gateway where client and server can send data between without any or with low latency. Best example is an online browser multiplayer game with a high score list that gets updated as soon as someone gets a new highscore.

<br>

### Authorization

The application has a basic html login and register window build with flash and for the authorization we used ejs instead of html files. Ejs stands for Embedded Javascript which means, you can use Javascript code inside your HTML file. All it needs is this syntax. <%= XYZ >

e.g.
Taken out of the login.ejs file

```
<% if (messages.error) { %>
  <%= messages.error %>
<% } %>
```


It's an easy way to use Javascript inside your file.

First we started to store our users only locally in an array and the array would get wiped every time the server restarted. Then we implemented a database and saved all our users in the database.

We used the npm module passport for this.

<br>
For example our function

![auth](/media/auth.png)
<br><br>
checks if the user is authenticated, if yes you get redirected to the chat, if not you will stay at the login screen.

Also the password is getting hashed with this function.

```
const hashedPassword = await bcrypt.hash(req.body.password, 10)
```

All it takes is the module brcypt, which automatically hashes your password.

To logout and get to the login screen, simply put /logout in the url after ```localhost:3000```


### Database

The database we chose was MongoDB. It is a NoSQL database and document oriented, which means that you can manage JSON files in it.

To implement the node module in our project we used:

```
const mongoose = require("mongoose");
```

We used the database to store three types of data. Old messages, the registrated users and all the swear words. Maybe you wonder why we store old messages.
We store them so when a user comes later to the room, the user will also gets the older messages and can read them.


## Chatrooms

After the login you come to a new window, where you can set your own chat room.

![chooseRoom.png](/media/chooseRoom.png)

When you accidentally choose the wrong room, you can easily change it via URL.
To change the chat room via URL, change ```.../room=X``` to ```.../room=Y``` The X and Y in this example is a number or a word e.g. You want to switch from room 5 to room panda change ```room=5``` to  ```room=panda``` \
Like we said before, you can see all the older chat messages other people have already written in this chat.
When you want to disconnect from the server, simply put /logout behind localhost:3000 like ->```localhost:3000/logout```


## Swearfilter

We implemented a filter for some adult words. Whenever you say one of this 9 bad words, it gets replaced by a correct amount of * characters.
The model is implemented in  ```swearword-model.js```, the list of bad words is in the ```initialize-filter.js``` and the function in the ```db-controller.js```

## Known Issues

When the login happens briefly after the server starts, there seems to be a problem with the initialization of passport. After refreshing the application works normally.

