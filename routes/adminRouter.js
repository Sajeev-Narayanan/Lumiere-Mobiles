const express = require("express");
const { check } = require("express-validator");

const adminControllers = require("../controllers/adminControllers");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const adminRouter = express.Router();

adminRouter.use(express.static("public"));

adminRouter.get("/", adminControllers.signinPage);
adminRouter.post("/", adminControllers.signin);
adminRouter.get("/dashboard", adminControllers.dashboard);
adminRouter.get("/logout", adminControllers.logout);
adminRouter.get("/showorder", adminControllers.showorder);
adminRouter.get("/showUser", adminControllers.showUser);
adminRouter.get("/showProduct", adminControllers.showProduct);
adminRouter.get("/addProductGet", adminControllers.addProductGet);
adminRouter.post("/addProductPost", adminControllers.addProductPost);
adminRouter.get("/showCategory", adminControllers.showCategory);
adminRouter.post("/addCategory", adminControllers.addCategory);
adminRouter.get("/showBrand", adminControllers.showBrand);
adminRouter.post("/addBrand", adminControllers.addBrand);

module.exports = adminRouter;
