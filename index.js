const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./Routes/user");
const chatRouter = require("./Routes/chat");
const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, application/json"
  );
  res.setHeader(
    "Access-Control-Allow-hEADER",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }

  next();
});

app.use("/user", userRouter);
app.use("/chat", chatRouter);

// console.log(process.env.MONGO_URL);
mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB!!!");
  }
);

const PORT = process.env.PORTT || 2000;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
