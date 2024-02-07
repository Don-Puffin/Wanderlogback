const createError = require("http-errors");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const saltRounds = 12;

const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

exports.register = async function (req, res, next) {
  try {
    const { username, password } = req.body; // request from frontend

    const existingUser = await Users.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }
    console.log("regex test:", regexPassword.test(password));
    if (!regexPassword.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-20 characters long and contain at least one letter, one number, and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash("password123", 12); // takes password and hashes the password, encryption
    console.log(hashedPassword);
    const newUser = new Users({ username, password: hashedPassword }); // creates an instance of the userModel with the request from the frontend

    await newUser.save(); // saves the user information into the database.

    //const token = uuidv4(); // assigns a token to the user. Token is stored in the variable token.
    const crypto = require("crypto");

    const secretKey = crypto.randomBytes(32).toString("hex");
    console.log(secretKey);

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

    res
      .status(201)
      .json({ token: newUser.token, message: "Registration Successful" });
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If the password matches, generate a token
    // const token = uuidv4();
    // user.token = token;
    // await user.save();
    //const token = uuidv4(); // assigns a token to the user. Token is stored in the variable token.
    const crypto = require("crypto");

    const secretKey = crypto.randomBytes(32).toString("hex");
    console.log(secretKey);

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

    res.json({ token, message: "Login successful" });
  } catch (error) {
    next(error);
  }
};

// exports.login = async function login(req, res, next) {
//   try {
//     const { username, password } = req.body;

//     const user = await Users.findOne({ username });

//     if (!user) {
//       console.error("The username was not found");
//       throw createError(401, "The username was not found");
//     }
//     const loginPassword = password;
//     console.log(loginPassword);
//     const dbPassword = user.password;
//     console.log(dbPassword);

//     const match = bcrypt.compare(loginPassword, dbPassword);

//     console.log("match done");
//     if (!match) {
//       console.log("No match");
//     } else {
//       console.log("Password matches");
//       user.token = uuidv4();
//       await user.save();
//       res.json({ token: user.token, message: "Login successful" });
//     }
//   } catch (error) {
//     next(error);
//     console.log("Password does not match");
//   }
// };

// const isMatch = await bcrypt.compare(password, user.password)
// if(!isMatch) {
//     throw createError(401, 'Invalid Credentials.')
// }
// console.log(isMatch)

// const checkPassword = (password) => {

//     const isRight = /^(?=.*[a-zA-Z0-9])(?=.*[\W_]).{8,20}$/g.test(password);
//     return isRight ? true : false

// };
// module.exports = checkPassword;

// const regexPassword = /^(?=.*[a-zA-Z0-9])(?=.*[\W_]).{8,20}$/;

// exports.register = async function (req, res, next) {
//   try {
//     const { username, password } = req.body; // request from frontend

//     const existingUser = await Users.findOne({ username });

//     if (existingUser) {
//       return res.status(400).json({ message: "Username already exists." });
//     }

//     if (!regexPassword.test(password)) {
//       return res.status(400).json({
//         message:
//           "Password must be 8-20 characters long and contain at least one letter, one number, and one special character.",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10); // takes password and hashes the password, encryption

//     const newUser = new Users({ username, password: hashedPassword }); // creates an instance of the userModel with the request from the frontend

//     newUser.token = uuidv4(); // assigns a token to the user. Token is stored in the variable token.
//     await newUser.save(); // saves the user information into the database.

//     res
//       .status(201)
//       .json({ token: newUser.token, message: "Registration Successful" });
//   } catch (error) {
//     next(error);
//   }
// };
