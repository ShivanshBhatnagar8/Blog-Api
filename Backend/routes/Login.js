const express = require("express");
const routes = express.Router();
const { loginUser, logoutUser } = require("../controllers/LoginController");
const { checkSchema } = require("express-validator");
const validationSchema = require("../utils/validations");

routes.post("/", checkSchema(validationSchema), loginUser);
routes.post("/logout", logoutUser);

module.exports = routes;
