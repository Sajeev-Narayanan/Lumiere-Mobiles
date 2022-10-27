const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  service: "Gmail",

  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});
const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

const home = (req, res) => {
  res.render("userpages/home");
};

const loginPageGet = (req, res) => {
  res.render("userpages/login", { msg: req.flash("invalid") });
};

const signupPageGet = (req, res) => {
  res.render("userpages/signup");
};

const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    mobile,
    email,
    username,
    password,
    type,
    state,
  } = req.body;

  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    firstName,
    lastName,
    mobile,
    email,
    username,
    password: hash,
    type,
    state,
  });
  req.session.useremail = req.body.email;

  //

  // const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  // const mailOptions = {
  //   from: "sajeevnarayanan817@gmail.com",
  //   to: email,
  //   subject: "Varify Your Email",
  //   html: `<p>Enter <b>${otp}</b> to varify your email address and complete signup process`,
  // };
  const mailOptions = {
    from: "royalmobiles@gmail.com",
    to: req.body.email,
    subject: "Otp for registration is: ",
    html: `<h3>Enter OTP to varify your email address and complete signup process</h3><h1>${otp}</h1>`, // html body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    res.render("userpages/otp", { msg: "" });
  });
  console.log(otp);

  try {
    await user.save();
    // res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.redirect("/signup");
  }
};

const verify = async (req, res) => {
  const email = req.session.useremail;
  if (req.body.otp == otp) {
    await User.updateOne({ email: email }, { state: true });
    res.redirect("/login");
  } else {
    res.render("userpages/otp", { msg: "otp is incorrect" });
  }
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      req.session.email = user.email;
      res.redirect("/");
    } else {
      req.flash("invalid", "invalid username or password");
      res.redirect("/login");
    }
  } else {
    req.flash("invalid", "invalid username or password");
    res.redirect("/login");
  }
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.home = home;
exports.signup = signup;

exports.loginPageGet = loginPageGet;
exports.signupPageGet = signupPageGet;
exports.verify = verify;
exports.loginPost = loginPost;
exports.logout = logout;
