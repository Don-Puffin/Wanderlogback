const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY
const User = require("../models/user");

// const redis = require("redis")
// const redisPass = process.env.REDIS_PW
// const client = redis.createClient({
//   password: redisPass,
//   socket: {
//       host: 'redis-15612.c55.eu-central-1-1.ec2.cloud.redislabs.com',
//       port: 15612
//   }
// })


exports.authUser = async function authUser(req, res, next) {
    const tokenToDecode = req.cookies.token; 
    if (!tokenToDecode) {
      return res.sendStatus(403);
    } else {
      try {
        //if coded token is on blacklist, return 403
        // await client.connect();

        // const result = await client.LRANGE(tokenToDecode,0,99999999)
        //  console.log(result);
        //   if(result.indexOf(tokenToDecode) > -1){
        //     return res.status(400).json({
        //       status: 400,
        //       error: 'Invalid Token'
        //   })}
        
        // await client.disconnect();

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
        req.codedToken = tokenToDecode;
        userIdToFind = req.decodedToken.userId;
        
        const user = await User.findOne({ _id: userIdToFind });
        const username = user.username;

        req.currentUser = username;
        req.success = true;
        next();
        //res.sendStatus(200);
      } catch (err) {
        console.log(err);
      }
    }
  };
  