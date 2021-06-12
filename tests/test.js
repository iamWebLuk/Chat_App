const { app } = require("../server.js");
const request = require("supertest");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");

describe("test root path", () => {
  it("should respond GET", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(302);
        done();
      });
  });
});

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

  test("send message", (done) => {
    clientSocket.on("hi", (arg) => {
      expect(arg).toBe("check");
      done();
    });
    serverSocket.emit("hi", "check");
  });
});
