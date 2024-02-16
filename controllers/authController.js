
const createError = require("http-errors");
const Users = require("../models/user");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const saltRounds = 12;

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
const secretKey = process.env.SECRET_KEY;

// const redis = require('redis');
// const redisPass = process.env.REDIS_PW;
// const client = redis.createClient({
//   password: redisPass,
//   socket: {
//       host: 'redis-15612.c55.eu-central-1-1.ec2.cloud.redislabs.com',
//       port: 15612
//   }
// })


exports.register = async function (req, res, next) {
  try {
    const { username, password } = req.body; // request from frontend

    const existingUser = await Users.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    if (!regexPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-20 characters long and contain at least one letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds); // takes password and hashes the password, encryption
    const newUser = new Users({ username, password: hashedPassword }); // creates an instance of the userModel with the request from the frontend
    const newUserProfile = new Profile({ 
      username: username,
      imageURL: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      bio: "Hi! I'm using WanderLog.",
      userLocation: "",
      visitedPlaces: [{}],
      wantToGoPlaces: [{}],
      userPosts: []
    });

    await newUser.save(); // saves the user information into the database.
    await newUserProfile.save(); // saves the user profile info into the database.

    const token = jwt.sign({ userId: newUser._id }, secretKey, {
      expiresIn: "1h",
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "None",
      path: "/",
      secure: true,
    });

    res.status(201).json({ status: 201, message: "Registration Successful" });
  } catch (error) {
    next(error);
  }
};
exports.login = async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await Users.findOne({ username });

    if (!user) {
      console.error("The username was not found");
      throw createError(401, "The username was not found");
    }

    const match = bcrypt.compare(password, user.password);

    if (!match) {
      console.log("Password does not match");
      throw res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "None",
      path: "/",
      secure: true,
    });

    res.json({ status: 200, message: "Login Successful" });
  } catch (error) {
    next(error);
  }
};

exports.auth = async function test(req, res, next) {
  try {
    if (req.success = true) {
    res.json({status: 200, username: req.currentUser})
  } else {
    res.json({status: 403})
  }
  } catch (error) {
    next(error)
  }
};

exports.logout = async function (req, res, next){
  // const decodedToken = req.decodedToken;
  // const codedToken = req.codedToken;

  try {
    // // await redisClient.LPUSH('token', token);
    // await client.connect()
    // const token_key = codedToken;
    // await client.set(token_key, codedToken);
    // client.expireAt(token_key, decodedToken.exp);
    // // await client.disconnect();

    res.clearCookie("token",{
      httpOnly:true,
      sameSite:"None",
      path:"/",
      secure:true,
    });
    res.json({ status:200, message:"logout Sucessful"});
  } catch (error){
    next(error);
  };
};