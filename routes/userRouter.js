const express = require("express");
const { check } = require("express-validator");
const userControllers = require("../controllers/userControllers");
const auth = require("../middleware/auth");
const Swal = require('sweetalert2')

const userRouter = express.Router();

// userRouter.use(express.static("public"));

userRouter.get("/", userControllers.home);

userRouter.get("/login", userControllers.loginPageGet);

userRouter.get("/signup", userControllers.signupPageGet);

userRouter.post("/signup", userControllers.signup);

userRouter.post("/verify", userControllers.verify);

userRouter.post("/loginPost", userControllers.loginPost);

userRouter.get("/logout",auth.sessionCheckuzUser, userControllers.logout);

userRouter.get("/cart", userControllers.cart);

userRouter.get("/mobile",userControllers.mobile);

userRouter.get("/wishList",userControllers.wishList);

userRouter.post("/wishlistPost",userControllers.wishlistPost);

userRouter.post("/wishlistDelete",userControllers.wishlistDelete);

userRouter.get("/profile",userControllers.profile);

userRouter.post("/addAddress",userControllers.addAddress);

userRouter.post("/addressDelete",userControllers.addressDelete);

userRouter.post("/userEdit",userControllers.userEdit);

userRouter.post("/userEditPost",userControllers.userEditPost);

userRouter.get("/changePassword",userControllers.changePassword);

userRouter.post("/changePasswordPost",userControllers.changePasswordPost);

userRouter.get("/product",userControllers.product);

userRouter.post("/cartAdd",userControllers.cartAdd);

userRouter.post("/quantityChange",userControllers.quantityChange);

userRouter.post("/cartDelete",userControllers.cartDelete);

userRouter.get("/checkout",userControllers.checkout);

userRouter.post("/confirm",userControllers.confirm);

userRouter.post("/payverify",userControllers.payverify);

userRouter.get("/MyOrder",userControllers.MyOrder);

userRouter.get("/MyOrder",userControllers.MyOrder);

userRouter.get("/orders",userControllers.orders);

userRouter.get("/couponPage",userControllers.couponPage);

module.exports = userRouter;
