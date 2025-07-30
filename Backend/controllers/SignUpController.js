const { createUser, fetchUserByEmail } = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function signUpUser(req, res) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { firstName, lastName, email, password, confirmPassword } =
        req.body;
      const user = await fetchUserByEmail(email);
      if (user) {
        return res.status(400).json("User with the username already exists!");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUser(firstName, lastName, email, hashedPassword);
        return res.status(200).json("User created successfully");
      }
    }
    return res.status(400).json({
      errors: result.array().map((el) => {
        return el.msg;
      }),
    });
  } catch (error) {
    res.status(500).json("Something went wrong, Please try again later");
  }
}
module.exports = { signUpUser };
