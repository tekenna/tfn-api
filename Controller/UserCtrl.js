const Users = require("../Models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { username, email, password, cf_password } = req.body;
      if (!username)
        return res.status(400).json({
          message: "Username required",
          status: 400,
        });

      if (!email || email === "")
        return res.status(400).json({
          message: "email required",
          status: 400,
        });

      if (!validateEmail(email))
        return res.status(400).json({
          message: "Email is invalid",
          status: 400,
        });

      if (!password) {
        return res.status(400).json({
          message: "password  required",
          status: 400,
        });
      }
      if (!cf_password) {
        return res.status(400).json({
          message: "password confirmation  required",
          status: 400,
        });
      }
      if (cf_password !== password) {
        return res.status(400).json({
          message: "Passwords mismatch",
          status: 400,
        });
      }
      const user = await Users.findOne({ email });
      if (user) {
        return res.status(422).json({
          message: "Email already taken",
          status: 422,
        });
      }
      const user_ = await Users.findOne({ username });
      if (user_) {
        return res.status(422).json({
          message: "Username already taken",
          status: 422,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await new Users({
        username,
        email,
        password: hashedPassword,
      }).save();
      // console.log(newUser);
      const access_token = jwt.sign(
        { email: email, username: username, id: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.status(200).json({
        message: "success",
        status: 200,
        data: {
          id: newUser._id,
          username: username,
          email: email,
          token: access_token,
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message,
        status: 500,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username) {
        return res.status(400).json({
          message: `username is required`,
          status: 400,
        });
      }

      const user = await Users.findOne({ username });

      if (!user)
        return res.status(401).json({
          message: "unauthorized",
          status: 401,
        });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid  password",
          status: 401,
        });
      }
      const access_token = jwt.sign(
        { email: user.email, username: user.username, id: user._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      return res.status(200).json({
        message: "success",
        status: 200,
        data: {
          id: user._id,
          email: user.email,
          username: user.username,
          token: access_token,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        status: 500,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || email === "") {
        return res.status(400).json({
          message: "email required",
          status: 400,
        });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: "Email is invalid",
          status: 400,
        });
      }
      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "user not found",
          status: 404,
        });
      }
      const reset_token = Math.floor(1000 + Math.random() * 9000);
      res.cookie("otp", reset_token, { maxAge: 50000 });
      return res.status(200).json({
        message: "verification code sent",
        reset_token,
        status: 200,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },

  resetPassword: async (req, res, next) => {
    try {
      const { email, otp, password, cf_password } = req.body;
      if (!email || email === "") {
        return res.status(400).json({
          message: "email required",
          status: 400,
        });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({
          message: "Email is invalid",
          status: 400,
        });
      }
      if (!otp) {
        return res.status(400).json({
          message: "otp required",
          status: 400,
        });
      }

      if (req.cookies.otp !== otp.toString()) {
        return res.status(400).json({
          message: "invalid otp",
          status: 400,
        });
      }
      if (!password || password === "") {
        return res.status(400).json({
          message: "password required",
          status: 400,
        });
      }
      if (!cf_password || cf_password === "") {
        return res.status(400).json({
          message: "password confirmation required",
          status: 400,
        });
      }
      if (password !== cf_password) {
        return res.status(400).json({
          message: "password mismatch",
          status: 400,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 12);

      const user = await Users.findOne({ email });
      if (!user) {
        return res.status(401).json({
          message: "user not found",
          status: 400,
        });
      }
      await Users.findOneAndUpdate(
        { _id: user._id },
        { password: hashedPassword },
        { new: true }
      );

      return res.status(200).json({
        message: "success",
        status: 200,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  },
};

const validateEmail = (email) => {
  const match =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return match.test(email);
};

module.exports = userCtrl;
