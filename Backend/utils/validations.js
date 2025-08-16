const { options } = require("../routes/SignUp");

const validationSchema = {
  firstName: {
    optional: true,
    isLength: {
      options: {
        min: 3,
        max: 30,
      },
    },
    errorMessage: "First Name should be between 3-30 characters",
    trim: true,
  },
  lastName: {
    optional: true,
    isLength: {
      options: {
        min: 3,
        max: 30,
      },
    },
    errorMessage: "Last Name should be between 3-30 characters",
    trim: true,
  },
  email: {
    optional: true,
    isEmail: true,
    errorMessage: "Not a valid email address",
  },
  password: {
    optional: true,
    isLength: {
      options: { min: 6 },
      errorMessage: "Password should be at least 6 chars",
    },
    trim: true,
  },
  confirmPassword: {
    optional: true,
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password doesn't match");
        }
        return true;
      },
    },
  },
  title: {
    optional: true,
    isLength: {
      options: { min: 10, max: 100 },
      errorMessage:
        "Title can have minimum 10 words and cannot exceed more than 100 words",
    },
  },
  content: {
    optional: true,
    isLength: {
      options: { min: 10, max: 10000 },
      errorMessage:
        "Content can have minimum 10 words and cannot exceed more than 10000 words",
    },
  },
  comment: {
    optional: true,
    isLength: {
      options: { max: 255 },
      errorMessage: "Cannot exceed more than 255 words",
    },
    trim: true,
  },
};

module.exports = validationSchema;
