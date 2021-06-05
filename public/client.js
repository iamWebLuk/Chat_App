var socket = io();

var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");


getUser()
  .then((data) => {
    socket.emit("new user", data.nickname);
  })
  .catch((err) => {
    console.error(err);
  });


form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    getUser()
      .then((data) => {
        var payload = {
          user: data.nickname,
          message: input.value,
        };
        socket.emit("message", payload);
        input.value = "";
      })
      .catch((err) => {
        console.error(err);
      });
  }
});


socket.on("message", (message) => {
  console.log(socket.userId);
  postMessage(message);
});


socket.on("new user", (data) => {
  postMessage(data);
});


function getUser() {
  return new Promise((resolve, reject) => {
    fetch("http://localhost:3000/profile")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
}

function postMessage(message) {
    var item = document.createElement("li");
    item.textContent = message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  }
