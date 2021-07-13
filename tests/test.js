const { createApp } = require("../authentication/app.js");
const { app, http } = require("../server/server.js");
const request = require("supertest");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("test paths (boilerplate)", () => {
  let appForTests;

  beforeAll(() => {
    appForTests = createApp(app);
  });

  afterAll(() => {
    http.close();
  });

  it("tests login GET", (done) => {
    request(appForTests)
      .get("/login")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  it("tests register GET", (done) => {
    request(appForTests)
      .get("/register")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  it("tests chat GET", (done) => {
    request(appForTests)
      .get("/chat")
      .then((response) => {
        expect(response.statusCode).toBe(302);
        done();
      });
  });

  it("tests logout GET", (done) => {
    request(appForTests)
      .get("/logout")
      .then((response) => {
        expect(response.statusCode).toBe(302);
        done();
      });
  });

  it("tests getUser GET", (done) => {
    request(appForTests)
      .get("/getUser")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

})
describe("basic connection test", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("socket send message", (done) => {
    clientSocket.on("hi", (arg) => {
      expect(arg).toBe("check");
      done();
    });
    serverSocket.emit("hi", "check");
  });
});
