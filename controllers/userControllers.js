const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const nodemailer = require("nodemailer");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Stock = require("../models/stockSchema");
const Wishlist = require("../models/wishlistSchema");
const { cloudinary } = require("../cloudinary");
const mongoose = require("mongoose");

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

const home = async(req, res) => {
  const product = await Product.find({});

  res.render("userpages/home",{product});
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
  console.log(otp);// #########################################################################################################
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

const cart = (req, res) => {
  res.render("userpages/cart");
};

const mobile = async(req,res)=>{
  const category = await Category.find({});
  const brand = await Brand.find({});
  const product = await Product.find({});
  res.render("userpages/mobiles",{category,brand,product})
}
const wishList = async(req,res)=>{
  const userEmail = req.session.email;
  const wished = await Wishlist.aggregate([{$match:{userEmail:userEmail}},{$unwind:'$wish_item'},{$lookup:{from:'products',localField:'wish_item.productId',foreignField:'_id',as:'products'}}])

if(userEmail){
res.render("userpages/wishlist",{wished})
}else{
 res.redirect("/login");
}
}

const wishlistPost = async(req,res)=>{
  let login = false;
  const {productId} = req.body;
  
  
  const userEmail = req.session.email;
  const wish = await Wishlist.findOne({$and:[{userEmail},{wish_item:{ $elemMatch:{productId }}}]})


  if(userEmail){
    if(wish == null){
    
       await Wishlist.updateOne(
      { userEmail: userEmail },
      { $push: { wish_item:{productId:productId}} },
      { upsert: true }
    );
       }
    login = true
    }
res.send({login})

}

const wishlistDelete = async(req,res)=>{
  let login = false;
  const {productId} =req.body;
  const userEmail = req.session.email;
  try{
  await Wishlist.updateOne(
    { userEmail: userEmail },
    { $pull: { wish_item:{productId:productId}} }
  );
  login = true
  }catch{
    res.send("error!!!!!!!!!!!!!!!!!!!!!")
  }
  res.send({login})

}

const profile = async(req,res)=>{
  const email = req.session.email;
  if(email){
  const user = await User.findOne({email})
  // const user = await User.aggregate([{$match:{email:email}},{$unwind:'$address'}])

  res.render("userpages/profile",{user})
  }else{
    res.redirect("/login")
  }
}


const addAddress = async(req,res)=>{
  const email =req.session.email;
  if(email){
    const{house_name,town,district,state,country,post_code} = req.body;
    await User.updateOne(
      { email: email },
      { $push: { address:{house_name:house_name,town:town,district:district,state:state,country:country,post_code:post_code}} },
      { upsert: true }
    );
    res.redirect("/profile")
  }else{

    res.redirect("/login")
  }
}

const addressDelete = async(req,res)=>{
  let deleted = false
  const email =req.session.email;
  const {addressId} = req.body;
try {
  await User.updateOne(
    { email: email },
    { $pull: { address:{_id:addressId}} }
  );

  deleted = true
} catch (error) {
  res.send("error!!!!!!!!!!!!!!!!!!!!!")
}  
res.send({deleted})

}

const userEdit = async(req,res)=>{
  
  const {userId} = req.body
 
const user = await User.findById(userId)
res.send({user})
}

const userEditPost = async(req,res)=>{
  const {email} = req.session.email;
  await User.findOneAndUpdate(email,req.body)
  res.redirect("/profile")
}

const changePassword = async(req,res)=>{
  const email  = req.session.email;
  
  const user = await User.findOne({ email})
  res.render("userpages/changePassword",{user,msag: req.flash("invalid"),msg: req.flash("valid")})
}

const changePasswordPost = async(req,res)=>{
  const email  = req.session.email;
  const user = await User.findOne({email})
  const {currentPassword,newPassword,confirmPassword} = req.body
  
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if(validPassword){
    if(newPassword == confirmPassword){
      const hash = await bcrypt.hash(newPassword, 12);
      await User.findOneAndUpdate(email,{password:hash});
      req.flash("valid","Successfully Changed");
  res.redirect("/changePassword");

    }else{
      req.flash("invalid", "Enter same password");
     res.redirect("/changePassword");
    }


  }else{
    req.flash("invalid", "Current password is incorrect");
    res.redirect("/changePassword");
  }
}

const product = async(req,res)=>{
  const {id} = req.params.id;
  const product = await Product.findById(id);
  res.render("userpages/product");
}

exports.home = home;
exports.signup = signup;
exports.loginPageGet = loginPageGet;
exports.signupPageGet = signupPageGet;
exports.verify = verify;
exports.loginPost = loginPost;
exports.logout = logout;
exports.cart = cart;
exports.mobile = mobile;
exports.wishList = wishList;
exports.wishlistPost = wishlistPost;
exports.wishlistDelete = wishlistDelete;
exports.profile = profile;
exports.addAddress = addAddress;
exports.addressDelete = addressDelete;
exports.userEdit = userEdit;
exports.userEditPost = userEditPost;
exports.changePassword = changePassword;
exports.changePasswordPost = changePasswordPost;
exports.product = product;
