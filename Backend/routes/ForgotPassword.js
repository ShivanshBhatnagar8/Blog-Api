const express = require("express");
const routes = express.Router();
const { updatePassword } = require("../controllers/ForgotPasswordController");
const { checkSchema } = require("express-validator");
const validationSchema = require("../utils/validations");

routes.patch("/", checkSchema(validationSchema), updatePassword);

module.exports = routes;
