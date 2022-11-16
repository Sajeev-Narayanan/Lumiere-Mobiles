const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const nodemailer = require("nodemailer");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Stock = require("../models/stockSchema");
const Wishlist = require("../models/wishlistSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const Banner = require("../models/bannerSchema");
const { cloudinary } = require("../cloudinary");
const mongoose = require("mongoose");
const { findOne } = require("../models/userSchema");
const { findOneAndUpdate } = require("../models/adminSchema");
const Razorpay = require('razorpay');
const crypto = require("crypto");

let instance = new Razorpay({ key_id: process.env.R_KEY_ID, key_secret: process.env.R_SECRET })

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

const home = async (req, res) => {
  const email = req.session.email
  const product = await Product.find({});
  const banner = await Banner.find({})


  res.render("userpages/home", { product,email,banner });
};

const loginPageGet = (req, res) => {
  const email = req.session.email
  res.render("userpages/login", { msg: req.flash("invalid"),email });
};

const signupPageGet = (req, res) => {
  const email = req.session.email
  res.render("userpages/signup",{email});
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
    res.render("userpages/otp", { msg: "otp is incorrect" },email);
  }
};

const loginPost = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (user) {
    if(user.state == true){
    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      req.session.email = user.email;
      req.session.type = user.type;
      req.session.state = user.state;
      res.redirect("/");
    } else {
      req.flash("invalid", "invalid username or password");
      res.redirect("/login");
    }
  } else {
    req.flash("invalid", "This account was blocked");
    res.redirect("/login");
  }}else{
    req.flash("invalid", "invalid username or password");
      res.redirect("/login");
  }
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};



const mobile = async (req, res) => {
  const email = req.session.email
  const category = await Category.find({});
  const brand = await Brand.find({});
  const product = await Product.find({});
  res.render("userpages/mobiles", { category, brand, product,email })
}
const wishList = async (req, res) => {
  const userEmail = req.session.email;
  const email = req.session.email
  const wished = await Wishlist.aggregate([{ $match: { userEmail: userEmail } }, { $unwind: '$wish_item' }, { $lookup: { from: 'products', localField: 'wish_item.productId', foreignField: '_id', as: 'products' } }])

  if (userEmail) {
    res.render("userpages/wishlist", { wished,email })
  } else {
    res.redirect("/login");
  }
}

const wishlistPost = async (req, res) => {
  let login = false;
  const { productId } = req.body;


  const userEmail = req.session.email;
  const wish = await Wishlist.findOne({ $and: [{ userEmail }, { wish_item: { $elemMatch: { productId } } }] })


  if (userEmail) {
    if (wish == null) {

      await Wishlist.updateOne(
        { userEmail: userEmail },
        { $push: { wish_item: { productId: productId } } },
        { upsert: true }
      );
    }
    login = true
  }
  res.send({ login })

}

const wishlistDelete = async (req, res) => {
  let login = false;
  const { productId } = req.body;
  const userEmail = req.session.email;
  try {
    await Wishlist.updateOne(
      { userEmail: userEmail },
      { $pull: { wish_item: { productId: productId } } }
    );
    login = true
  } catch {
    res.send("error!!!!!!!!!!!!!!!!!!!!!")
  }
  res.send({ login })

}

const profile = async (req, res) => {
  const email = req.session.email;
  if (email) {
    const user = await User.findOne({ email })
    // const user = await User.aggregate([{$match:{email:email}},{$unwind:'$address'}])

    res.render("userpages/profile", { user,email })
  } else {
    res.redirect("/login")
  }
}


const addAddress = async (req, res) => {
  const email = req.session.email;
  const check = req.query.check;
  if (email) {
    const { house_name, town, district, state, country, post_code } = req.body;
    await User.updateOne(
      { email: email },
      { $push: { address: { house_name: house_name, town: town, district: district, state: state, country: country, post_code: post_code } } },
      { upsert: true }
    );
    if (check == "checkOut") {
      res.redirect("/chechout")
    } else {
      res.redirect("/profile")
    }
  } else {

    res.redirect("/login")
  }
}

const addressDelete = async (req, res) => {
  let deleted = false
  const email = req.session.email;
  const { addressId } = req.body;
  try {
    await User.updateOne(
      { email: email },
      { $pull: { address: { _id: addressId } } }
    );

    deleted = true
  } catch (error) {
    res.send("error!!!!!!!!!!!!!!!!!!!!!")
  }
  res.send({ deleted })

}

const userEdit = async (req, res) => {

  const { userId } = req.body

  const user = await User.findById(userId)
  res.send({ user })
}

const userEditPost = async (req, res) => {
  const { email } = req.session.email;
  await User.findOneAndUpdate(email, req.body)
  res.redirect("/profile")
}

const changePassword = async (req, res) => {
  const email = req.session.email;
if(email){
  const user = await User.findOne({ email })
  res.render("userpages/changePassword", { user, msag: req.flash("invalid"), msg: req.flash("valid"),email })
}else{
  res.redirect("/login")
}
}

const changePasswordPost = async (req, res) => {
  const email = req.session.email;
  const user = await User.findOne({ email })
  const { currentPassword, newPassword, confirmPassword } = req.body

  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (validPassword) {
    if (newPassword == confirmPassword) {
      const hash = await bcrypt.hash(newPassword, 12);
      await User.findOneAndUpdate(email, { password: hash });
      req.flash("valid", "Successfully Changed");
      res.redirect("/changePassword");

    } else {
      req.flash("invalid", "Enter same password");
      res.redirect("/changePassword");
    }


  } else {
    req.flash("invalid", "Current password is incorrect");
    res.redirect("/changePassword");
  }
}

const product = async (req, res) => {
  const id = mongoose.Types.ObjectId(req.query.id);
  const email = req.session.email

  try {
    const product = await Product.findById(id);
    
    const stock = await Stock.findOne({ productId: id })
    if(product){
    res.render("userpages/product", { product, stock,email });
    }else{
      res.render("pageNotFound.ejs");
    }

  } catch (error) {
    res.render("pageNotFound.ejs");
  }




}

const cartAdd = async (req, res) => {
  let login = false;
  const email = req.session.email;

  const { productId } = req.body;
  const stock = await Stock.findOne({ productId: productId })
  if(stock.stock>0){
  let product_quantity;
  req.body.product_quantity ? (product_quantity = req.body.product_quantity) : (product_quantity = 1);
  const cartItems = await Cart.findOne({ $and: [{ email }, { cart_item: { $elemMatch: { productId } } }] })

  if (email) {
    if (cartItems == null) {

      await Cart.updateOne(
        { email: email },
        { $push: { cart_item: { productId: productId, product_quantity: product_quantity } } },
        { upsert: true }
      );
    } else {

      await Cart.findOneAndUpdate({ $and: [{ email }, { "cart_item.productId": productId }] }, { "cart_item.$.product_quantity": product_quantity });
    }
    login = true
  }
}
  res.send({ login,stock })

}


const cart = async (req, res) => {
  const email = req.session.email;
  const cartDetails = await Cart.aggregate([{ $match: { email: email } }, { $unwind: '$cart_item' }, { $lookup: { from: 'products', localField: 'cart_item.productId', foreignField: '_id', as: 'products' } }])
  let price = 0;
  for (cartele of cartDetails) {
    for (prd of cartele.products) {
      price += prd.finalPrice * cartele.cart_item.product_quantity
    }
  }

  if(email){
  res.render("userpages/cart", { cartDetails, price,email });
  }else{
    res.redirect("/login")
  }
};

const quantityChange = async (req, res) => {
  let change = false;
  const { productId, cartId, count, qty } = req.body;
  const email = req.session.email;
  try {

    await Cart.findOneAndUpdate({ $and: [{ email }, { "cart_item.productId": productId }] }, { $inc: { "cart_item.$.product_quantity": count } });
    change = true

  } catch (error) {
    console.log(error);
  }
  res.send({ change })
}

const cartDelete = async (req, res) => {
  let deleted = false;
  const { productId } = req.body;
  const email = req.session.email;
  try {
    await Cart.updateOne(
      { email: email },
      { $pull: { cart_item: { productId: productId } } }
    );
    deleted = true
  } catch {
    res.send("error!!!!!!!!!!!!!!!!!!!!!")
  }
  res.send({ deleted })

}

const checkout = async (req, res) => {
  const email = req.session.email;
  if (email) {
    const cartDetails = await Cart.aggregate([{ $match: { email: email } }, { $unwind: '$cart_item' }, { $lookup: { from: 'products', localField: 'cart_item.productId', foreignField: '_id', as: 'products' } }])
    const user = await User.findOne({ email })

    let price = 0;
    if(cartDetails[0]){
    for (cartele of cartDetails) {
      for (prd of cartele.products) {
        price += prd.finalPrice * cartele.cart_item.product_quantity
      }
    }
    res.render("userpages/checkOut", {  error: req.flash("error"),user, cartDetails, price,email })
  }else{
    res.redirect("/mobile")
  }
  } else {
    res.redirect('/login');
  }


}

const confirm = async (req, res) => {
  const email = req.session.email;
  // console.log(req.body);
  const method = req.body.selector === 'cod' ? true : false
  const payType = req.body.selector;
  const cart = await Cart.findOne({ email })
  const address = { name: req.body.name, email: req.body.email, mobile: req.body.mobile, address_line: req.body.address_line }
  const order = new Order({
    email: email,
    cart_item: cart.cart_item,
    isCompleted: method,
    address,
    paymentStatus: payType,
    bill:req.body.bill,
    orderStatus: [{
      date: Date.now()
    }],
  })
  let insertId = order._id
  await order.save()
  if (payType === 'cod') {
    
    const cod = true;

    for (const carts of cart.cart_item) {
      
      let prId = carts.productId
     
      let count = carts.product_quantity * -1
     
      await Stock.findOneAndUpdate({productId:prId}, { $inc: { stock: count } })
    }
    
    
    await Cart.findOneAndDelete(email)
    res.send({cod,insertId})
    
  } else {
    // const order= checkout._id
    // const total = b
    const user = await User.findOne({email});
    const fullName = user.firstName + '' + user.lastName
    const mobile = user.mobile
    // const Email = user.email
    // console.log(Email);
    const options = {
      amount: 100, // amount in the smallest currency unit checkout.bill
      currency: "INR",
      receipt: "" + insertId
    };
    instance.orders.create(options, function (err, order) {
      const orderId = order.id;

      const userDetails = {
        fullName,
        mobile,
        email,
      };
      res.send({
        options,
        userDetails,
        orderId
      });

      // console.log(order)

    })
    
   
  }
}

const payverify = async(req,res)=>{
  const email = req.session.email
  
     const { response,payDetails,userDetails,orderId } = req.body;
     let hmac = crypto.createHmac('sha256', process.env.R_SECRET);
     hmac = hmac.update(response.razorpay_order_id + "|" + response.razorpay_payment_id);
     hmac = hmac.digest('hex');
     
     if(hmac == response.razorpay_signature) {
         const email = req.session.email
         
         const cart = await Cart.findOne({email:email})
         // console.log(cart)
         const successOrderId = mongoose.Types.ObjectId(payDetails.receipt);
     await Order.findByIdAndUpdate(successOrderId,{isCompleted:true});
     for (const carts of cart.cart_item) {
      
      let prId = carts.productId
     
      let count = carts.product_quantity * -1
     
      await Stock.findOneAndUpdate({productId:prId}, { $inc: { stock: count } })
    }
     await Cart.findByIdAndDelete(cart._id)
         req.flash('orderId',successOrderId);
         res.send({paymentStatus:'success',successOrderId});
     }else {
         res.send({paymentStatus:'fail'});
 }
 }

 const MyOrder = async(req,res)=>{
  const email = req.session.email;
  const orderId = mongoose.Types.ObjectId(req.query.orderId);
 
  
  const productDetails = await Order.aggregate([{ $match: { _id:orderId } }, { $unwind: '$cart_item' }, { $lookup: { from: 'products', localField: 'cart_item.productId', foreignField: '_id', as: 'products' } }])
  const orderDetails = await Order.findOne({_id:orderId})

  
  res.render("userpages/orders",{orderDetails,productDetails,email})
 }


 const orders = async(req,res)=>{
  const email = req.session.email;
  if(email){
  const user = await User.findOne({ email })
  const productDetails = await Order.aggregate([{ $match: { email:email } }, { $unwind: '$cart_item' }, { $lookup: { from: 'products', localField: 'cart_item.productId', foreignField: '_id', as: 'products' } }])
  res.render("userpages/userOrder",{user,productDetails,email})
  }else{
    res.redirect("/login")
  }
 }
 const couponPage = async(req,res)=>{
  const email = req.session.email;
  const coupon = await Coupon.find({})
  res.render("userpages/coupon",{coupon,email})
 }

 const sort = async(req,res)=>{
  const select = req.body.select
  let product
  if(select == 1){
    product = await Product.find({});
  }
  else if(select == 2){
    product = await Product.find({}).sort({price: 1});
  }else if(select == 3){
    product = await Product.find({}).sort({price: -1});
  }
  res.send({product});
 }

 const catagorySort = async(req,res)=>{
  
  const catagoryId = mongoose.Types.ObjectId(req.body.catagoryId);
  
  const product = await Product.find({category_id:catagoryId})
  
  res.send({product});

 }

 const filter = async(req,res)=>{
  const {brand,ram,memory,discount,price,sort} = req.body;
  // const brand = mongoose.Types.ObjectId(req.body.brand);
  let product = ""
  if(brand&&ram&&memory&&discount&&price){
    if(sort == 1){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory,discount:{$gte:discount},finalPrice:{$lte:price}});
    }else if(sort == 2){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory,discount:{$gte:discount},finalPrice:{$lte:price}}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory,discount:{$gte:discount},finalPrice:{$lte:price}}).sort({price: -1});
    }
    
     
  }else if(brand&&ram&&memory&&discount){
    if(sort == 1){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory,discount:{$gte:discount}});
    }
    else if(sort == 2){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory,discount:{$gte:discount}}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory,discount:{$gte:discount}}).sort({price: -1});
    }
   
    
  }else if(brand&&ram&&memory){
    if(sort == 1){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory});
    }
    else if(sort == 2){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({brand_id:brand,ram:ram,memory:memory}).sort({price: -1});
    }
    
    
  }else if(brand&&ram){
    if(sort == 1){
      product = await Product.find({brand_id:brand,ram:ram});
    }
    else if(sort == 2){
      product = await Product.find({brand_id:brand,ram:ram}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({brand_id:brand,ram:ram}).sort({price: -1});
    }
   
   
  }else if(brand){
    if(sort == 1){
      product = await Product.find({brand_id:brand});
    }
    else if(sort == 2){
      product = await Product.find({brand_id:brand}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({brand_id:brand}).sort({price: -1});
    }
    
   
  }else if(ram){
    if(sort == 1){
      product = await Product.find({ram:ram});
    }
    else if(sort == 2){
      product = await Product.find({ram:ram}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({ram:ram}).sort({price: -1});
    }
    
   
  }else if(memory){
    if(sort == 1){
      product = await Product.find({memory:memory});
    }
    else if(sort == 2){
      product = await Product.find({memory:memory}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({memory:memory}).sort({price: -1});
    }
   
    
  }else if(discount){
    if(sort == 1){
      product = await Product.find({discount:{$gte:discount}});
    }
    else if(sort == 2){
      product = await Product.find({discount:{$gte:discount}}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({discount:{$gte:discount}}).sort({price: -1});
    }
    
    
  }else if(price){
    if(sort == 1){
      product = await Product.find({finalPrice:{$lte:price}});
    }
    else if(sort == 2){
      product = await Product.find({finalPrice:{$lte:price}}).sort({price: 1});
    }else if(sort == 3){
      product = await Product.find({finalPrice:{$lte:price}}).sort({price: -1});
    }
    
    
  }else{
    product = await Product.find({})
  }
   res.send({product}) 
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
  exports.cartAdd = cartAdd;
  exports.quantityChange = quantityChange;
  exports.cartDelete = cartDelete;
  exports.checkout = checkout;
  exports.confirm = confirm;
  exports.payverify = payverify;
  exports.MyOrder = MyOrder;
  exports.orders = orders;
  exports.couponPage = couponPage;
  exports.sort = sort;
  exports.catagorySort = catagorySort;
  exports.filter = filter;
