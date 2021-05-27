const { app } = require("./server.js");
const request = require("supertest");

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