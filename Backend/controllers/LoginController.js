const { fetchUserByEmail } = require("../db/queries");
const { validationResult } = require("express-validator");
const { createAuthToken } = require("../utils/authorization");
const bcrypt = require("bcryptjs");

async function loginUser(req, res) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { email, password } = req.body;
      const user = await fetchUserByEmail(email);
      if (!user) {
        return res.status(400).json("Incorrect UserName");
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json("Incorrect Password");
      }
      const token = createAuthToken(user.id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
        secure: true,
      });
      return res.status(200).json(`Login Successful`);
    }
    return res.status(400).json({
      errors: result.array().map((el) => {
        return el.msg;
      }),
    });
  } catch (error) {
    res.status(500).json("Something went Wrong");
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
    res.status(200).json(`Logout successful`);
  } catch (error) {
    return res.status(500).json("Something went Wrong");
  }
}
module.exports = {
  loginUser,
  logoutUser,
};
