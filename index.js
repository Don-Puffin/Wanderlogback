require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3001;
const router = require("./routes/authRoutes.js");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
mongoose
  .connect(process.env.WANDERLOG_DB)
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(router);
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
