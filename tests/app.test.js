const request = require("supertest");
const app = require("../index");
/*----------------------------------------------------- ---Authentication Testinga---------------------------------------------------------------------*/
describe("Authentication API", () => {
  let token; // store token for authenticated requests

  // Register
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Registration Successful");
  });

  // Login
  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Login Successful");
    token = res.headers["set-cookie"][0]; // save the token for authenticated requests
  });

  it("should not login with incorrect password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "nouser", password: "wrongpassword1234!" });
    expect(res.statusCode).toEqual(401);
  });

  // Test authenticated route
  it("should access a protected route with valid token", async () => {
    const res = await request(app).post("/auth/auth").set("Cookie", [token]); // set the saved token
    expect(res.statusCode).toEqual(200);
  });

  it("should not access a protected route without token", async () => {
    const res = await request(app).post("/auth/auth");
    expect(res.statusCode).toEqual(403);
  });
});

/*------------------------------------------ Post testing ---------------------------------------------**/

describe ("Post API", () => {

  it("should create a new post", async () => {
    const res = await request(app)
      .post("/post/create")
      .set("Cookie", [token])
      .send({ postText: "test post", postLocation: "test location" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Post created successfully");
  })

  it("should get all posts", async () => {
    const res = await request(app)
      .get("/post/posts")
      .set("Cookie", [token])
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Posts retrieved successfully");
  })

  it("should not get posts without token", async () => {
    const res = await request(app)
      .get("/post/posts")
    expect(res.statusCode).toEqual(403);
  })

  it("should delete a post", async () => {
    const res = await request(app)
      .delete("/post/delete/1")
      .set("Cookie", [token])
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Post deleted successfully");
  })

  it("should not delete a post without token", async () => {
    const res = await request(app)
      .delete("/post/delete/1")
    expect(res.statusCode).toEqual(403);
  })

  it("should update a post", async () => {
    const res = await request(app)
      .put("/post/update/1")
      .set("Cookie", [token])
      .send({ postText: "test post", postLocation: "test location" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Post updated successfully");
  })

  it("should not update a post without token", async () => {
    const res = await request(app)
      .put("/post/update/1")
      .send({ postText: "test post", postLocation: "test location" });
    expect(res.statusCode).toEqual(403);
  })

  

})



/*-------------------------------------------- Profile testing -------------------------------------------*/