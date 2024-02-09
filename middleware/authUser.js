
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY

exports.authUser = async function authUser(req, res, next) {
    // req.cookies comes back undefined - cookie parser isn't working. why?
    console.log(req.cookies)
    const tokenToDecode = req.cookies.token; //this throws error as undefined
    console.log("auth secret key", secretKey)
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
              console.log(decode);
              return decode;
            }
          }
        );
        req.decodedToken = decoded;
        console.log(decoded)
        next();
      } catch (err) {
        console.log(err);
      }
    }
  };
  