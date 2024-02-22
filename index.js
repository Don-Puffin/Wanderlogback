require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3001;
const authRouter = require("./routes/authRoutes.js");
const postRouter = require("./routes/postRoutes.js");
const profileRouter = require("./routes/profileRoutes.js");
const mapRouter = require("./routes/mapRoutes.js");

const mongoose = require("mongoose");
const request = require("supertest");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors({
  origin: true,
  credentials: true
}));

mongoose
  .connect(process.env.WANDERLOG_DB)
  // .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/profile", profileRouter);
app.use("/map", mapRouter);

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
module.exports = app;
