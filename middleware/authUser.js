
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY
const User = require("../models/user");

exports.authUser = async function authUser(req, res, next) {
    // req.cookies comes back undefined - cookie parser isn't working. why?
    const tokenToDecode = req.cookies.token; //this throws error as undefined
    if (!tokenToDecode) {
      return res.sendStatus(403);
    } else {
      try {
        const decoded = jwt.verify(
          tokenToDecode,
          secretKey,
          function (err, decode) {
            if (err) {
              res.sendStatus(403);
            } else {
              return decode;
            }
          }
        );
        req.decodedToken = decoded;
        
        console.log(decoded)
        userIdToFind = req.decodedToken.userId;

        const user = await User.findOne({ _id: userIdToFind });
        const username = user.username;

        req.currentUser = username;

        next();
      } catch (err) {
        console.log(err);
      }
    }
  };
  