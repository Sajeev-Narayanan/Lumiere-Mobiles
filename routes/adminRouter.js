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
adminRouter.get("/userState/:id", adminControllers.userState);
adminRouter.get("/userStateUn/:id", adminControllers.userStateUn);
adminRouter.get("/showProduct", adminControllers.showProduct);
// adminRouter.get("/addProductGet", adminControllers.addProductGet);
// adminRouter.post("/addProductPost", adminControllers.addProductPost);
adminRouter
  .route("/addProduct")
  .get(adminControllers.addProductGet)
  .post(upload.array("image"), adminControllers.addProductPost);

adminRouter.delete("/deleteProduct/:_id", adminControllers.deleteProduct);
adminRouter.get("/editProductGet/:_id", adminControllers.editProductGet);
adminRouter.put(
  "/editProductEdit/:_id",
  upload.array("image"),
  adminControllers.editProductEdit
);
adminRouter.get("/showCategory", adminControllers.showCategory);
adminRouter.post("/addCategory", adminControllers.addCategory);
adminRouter.get("/showBrand", adminControllers.showBrand);
adminRouter.post("/addBrand", adminControllers.addBrand);
adminRouter.get("/showStock", adminControllers.showStock);
adminRouter.post("/addStock/:Id", adminControllers.addStock);

module.exports = adminRouter;
