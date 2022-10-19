const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.use(express.static("public"));

userRouter.get("/", userControllers.home);

userRouter.get("/login", userControllers.loginPageGet);

userRouter.get("/signup", userControllers.signupPageGet);

userRouter.post("/signup", userControllers.signup);

module.exports = userRouter;
