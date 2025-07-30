const { updatePasswordOfUser, fetchUserByEmail } = require("../db/queries");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

async function updatePassword(req, res) {
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const { email, password } = req.body;
      const user = await fetchUserByEmail(email);
      if (!user) {
        return res.status(400).json("Incorrect Username");
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        await updatePasswordOfUser(email, hashedPassword);
        return res.status(200).json("Password reset successfully!");
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

module.exports = { updatePassword };
