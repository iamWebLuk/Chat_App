const { app } = require("../server.js");
const request = require("supertest");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const {
  SERVER_PORT,
  ISSUER_BASE_URL,
  CLIENT_ID,
  BASE_URL,
  SECRET,
} = require("../config");

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

describe("my awesome project", () => {
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

  test("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });
});
