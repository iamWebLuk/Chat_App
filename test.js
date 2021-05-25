const { app } = require("./server.js")
const request = require("supertest");


describe("Test the root path", () => {
  test("should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(302)
        done()
      });
  });
});