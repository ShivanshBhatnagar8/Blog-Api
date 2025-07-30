const jwt = require("jsonwebtoken");

function createAuthToken(id) {
  return jwt.sign({ id }, "secret", { expiresIn: "7d" });
}

function verifyAuthToken(req, res, next) {
  if (!req.cookies.jwt) {
    return res
      .status(401)
      .json(
        "This page is available to logged-in users only. Please log in to continue."
      );
  }

  jwt.verify(req.cookies.jwt, "secret", (error, decodedToken) => {
    if (error) {
      return res.status(401).json("Invalid token");
    }
    req.user = decodedToken;
    next();
  });
}

module.exports = { createAuthToken, verifyAuthToken };
