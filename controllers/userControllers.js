const bcrypt = require("bcrypt");
const User = require("../models/userSchema");

const home = (req, res) => {
  res.render("userpages/home");
};

const loginPageGet = (req, res) => {
  res.render("userpages/login");
};

const signupPageGet = (req, res) => {
  res.render("userpages/signup");
};

const signup = async (req, res) => {
  const { firstName, lastName, mobile, email, username, password } = req.body;

  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    firstName,
    lastName,
    mobile,
    email,
    username,
    password: hash,
  });
  try {
    await user.save();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/signup");
  }
};

exports.home = home;
exports.signup = signup;

exports.loginPageGet = loginPageGet;
exports.signupPageGet = signupPageGet;
