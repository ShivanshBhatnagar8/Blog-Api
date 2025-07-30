const path = require("node:path");
const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();

const signUpRoutes = require("./routes/SignUp");
const forgotPasswordRoutes = require("./routes/ForgotPassword");
const loginRoutes = require("./routes/Login");
const postRoutes = require("./routes/Posts");
const commentRoutes = require("./routes/Comments");

app.use(
  cors({
    origin: true,
    credentials: true,
    withCredentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/signup", signUpRoutes);
app.use("/forgotpassword", forgotPasswordRoutes);
app.use("/", loginRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.listen(3000);
