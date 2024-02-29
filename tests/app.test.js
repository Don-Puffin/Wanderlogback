const request = require("supertest");
const app = require("../index");
/*----------------------------------------------------- ---Authentication Testinga---------------------------------------------------------------------*/
describe("API tests", () => {
  let token; // store token for authenticated requests
  let id;
  let postArray;

  // Register
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Registration successful!");
  });

  it("should not register a new user with a username that already exists", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Username already exists.");
  });

  it("should not register a new user with capital letters in username", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "Brian", password: "Password1234!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Username must be 3-20 characters long and cannot include capital letters.");
  });

  it("should not register a new user with too short a username", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "br", password: "Password1234!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Username must be 3-20 characters long and cannot include capital letters.");
  });

  it("should not register a new user with too long a username", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "thisusernameismorethantwentyletterslong", password: "Password1234!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Username must be 3-20 characters long and cannot include capital letters.");
  });

  it("should not register a new user with a weak password (no caps)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "password1234!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  });

  it("should not register a new user with a weak password (no numbers)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "Password!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  });

  it("should not register a new user with a weak password (no symbols)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "Password1234" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  });

  it("should not register a new user with a weak password (no symbols)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "Password1234" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  });
  
  it("should not register a new user with a weak password (too short)", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "Abc123!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  });

  it("should not register a new user with a password that is too long", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "newuser", password: "ThisPasswordIsMuchTooLong1234!" });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
  });

  // Login
  it("should not login with incorrect password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "fred", password: "Wrongpassword1234!" });
    expect(res.statusCode).toEqual(401);
  });

  it("should not login with incorrect username", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "wrongusername", password: "Password1234!" });
    expect(res.statusCode).toEqual(401);
  });

  it("should login with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "fred", password: "Password1234!" });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Login successful!");
    token = res.headers["set-cookie"][0]; 
  });


  // Test authenticated route
  it("should access a protected route with valid token", async () => {
    const res = await request(app).post("/auth/auth").set("Cookie", [token]); 
    expect(res.statusCode).toEqual(200);
  });

  it("should not access a protected route without token", async () => {
    const res = await request(app).post("/auth/auth");
    expect(res.statusCode).toEqual(403);
  });

/*------------------------------------------ Post testing ---------------------------------------------**/


  it("should create a new post", async () => {
    const res = await request(app)
      .post("/post/create")
      .set("Cookie", [token])
      .send({ postText: "test post", postLocationData: {name: "test place", lat:0, long:0, rating: 3}, postImage: "/" });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("Post created successfully!");
  })

  it("should get all posts", async () => {
    const res = await request(app)
      .get("/post/posts")
      .set("Cookie", [token])
    expect(res.statusCode).toEqual(200);
    postArray = res.body.posts;
    id = res.body.posts[(postArray.length-1)].id;
  })

  it("should not get posts without token", async () => {
    const res = await request(app)
      .get("/post/posts")
    expect(res.statusCode).toEqual(403);
  })

  it("should update a post", async () => {
    const res = await request(app)
      .put(`/post/update/${id}`)
      .set("Cookie", [token])
      .send({ rating: 4});
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Post updated successfully!");
  })

  it("should not update a post without token", async () => {
    const res = await request(app)
      .put(`/post/update/${id}`)
      .send({ postText: "test post", postLocation: "test location" });
    expect(res.statusCode).toEqual(403);
  })

  it("should delete a post", async () => {
    const res = await request(app)
      .delete(`/post/delete/${id}`)
      .set("Cookie", [token])
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Post deleted successfully!");
  })

  it("should not delete a post without token", async () => {
    const res = await request(app)
      .delete(`/post/delete/${id}`)
    expect(res.statusCode).toEqual(403);
  })

  

})



/*-------------------------------------------- Profile testing -------------------------------------------*/