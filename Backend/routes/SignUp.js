const express = require("express");
const routes = express.Router();
const { signUpUser } = require("../controllers/SignUpController");
const { checkSchema } = require("express-validator");
const validationSchema = require("../utils/validations");

routes.post("/", checkSchema(validationSchema), signUpUser);

module.exports = routes;
