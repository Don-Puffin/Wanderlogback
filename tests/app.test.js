const request = require("supertest");
const app = require("../index");

describe("Authentication API", () => {
  let token; // store token for authenticated requests

  // Register
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/register")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Registration Successful");
  });

  // Login
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Login Successful");
    token = res.headers["set-cookie"][0]; // save the token for authenticated requests
  });

  it("should not login with incorrect password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "nouser", password: "wrongpassword1234!" });
    expect(res.statusCode).toEqual(401);
  });

  // Test authenticated route
  it("should access a protected route with valid token", async () => {
    const res = await request(app).post("/test").set("Cookie", [token]); // set the saved token
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("test successful");
  });

  it("should not access a protected route without token", async () => {
    const res = await request(app).post("/test");
    expect(res.statusCode).toEqual(403);
  });
});
