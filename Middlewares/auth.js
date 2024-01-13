const Users = require("../Models/user");
const jwt = require("jsonwebtoken");

const auth = {
  user: async (req, res, next) => {
    try {
      let token = req.headers["x-access-token"] || req.headers["authorization"];
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
          status: 401,
        });
      }
      if (token.includes(`Bearer `)) {
        token = token.slice(7, token.length);
         console.log(token)
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
          if (err) {
            // console.log(err)
            return res.status(401).json({
              message: "Invalid token",
              status: 401,
            });
          } else {
            req.token = token;
            next();
          }
        });
      } else {
        return res.status(401).json({
          message: "Unauthorized, token required",
          status: 401,
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        status: 500,
      });
    }
  },
};

module.exports = auth;
