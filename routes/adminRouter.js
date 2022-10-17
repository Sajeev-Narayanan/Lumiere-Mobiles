const express = require("express");
const { check } = require("express-validator");

const adminControllers = require("../controllers/adminControllers");

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

module.exports = adminRouter;
