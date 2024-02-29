
const createError = require("http-errors");
const Users = require("../models/user");
const Profile = require("../models/profile");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const saltRounds = 12;

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
const regexUsername = /^[a-z\d-]{3,20}$/;
const secretKey = process.env.SECRET_KEY;

// Redis code for future improvements
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
    const { username, password } = req.body; 

    if (!regexUsername.test(username)) {
      return res
        .status(400)
        .json({ message: "Username must be 3-20 characters long and cannot include capital letters." });
    }

    const existingUser = await Users.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ status: 400, message: "Username already exists." });
    }
    if (!regexPassword.test(password)) {
      return res.status(400).json({
        status: 400,message:
          "Password must be 8-20 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds); // takes password and hashes the password, encryption
    const newUser = new Users({ username, password: hashedPassword });
    const newUserProfile = new Profile({ 
      username: username,
      imageURL: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
      bio: "Hi! I'm using WanderLog.",
      userLocation: "",
      visitedPlaces: [],
      wantToGoPlaces: [],
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

    res.status(201).json({ status: 201, message: "Registration successful!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, message: "Internal server error." }); // Send a generic error message to the client
  }
};
exports.login = async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    console.log(password)

    const user = await Users.findOne({ username });

    if (!user) {
      console.error("The username was not found");
      return res.status(401).json({ message: "Invalid username or password." });
    }

    console.log(password, user.password)

    const match = await bcrypt.compare(password, user.password);
  
    console.log(match);

    if (!match) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid username or password." });
    }
    
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "3h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      sameSite: "None",
      path: "/",
      secure: true,
    });

    res.json({ status: 200, message: "Login successful!" });
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

  try {
    // Redis code for future improvements
    // await redisClient.LPUSH('token', token);
    // await client.connect()
    // const token_key = codedToken;
    // await client.set(token_key, codedToken);
    // client.expireAt(token_key, decodedToken.exp);
    // await client.disconnect();

    res.clearCookie("token",{
      httpOnly:true,
      sameSite:"None",
      path:"/",
      secure:true,
    });
    res.json({ status:200, message:"Logout successful!"});
  } catch (error){
    next(error);
  };
};