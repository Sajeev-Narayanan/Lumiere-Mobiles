const express = require("express");
const { check } = require("express-validator");

const adminControllers = require("../controllers/adminControllers");
const auth = require("../middleware/auth");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const adminRouter = express.Router();

adminRouter.use(express.static("public"));

adminRouter.get("/",auth.sessionCheckAdminLogin, adminControllers.signinPage);
adminRouter.post("/",auth.sessionCheckAdminLogin, adminControllers.signin);
adminRouter.get("/dashboard",auth.sessionCheckDashboard, adminControllers.dashboard);
adminRouter.get("/logout",auth.sessionCheckDashboard, adminControllers.logout);
adminRouter.get("/showorder",auth.sessionCheckDashboard, adminControllers.showorder);
adminRouter.post("/orderstatus",auth.sessionCheckDashboard,adminControllers.orderstatus);
adminRouter.post("/orderCancel",auth.sessionCheckDashboard,adminControllers.orderCancel);
adminRouter.get("/showUser",auth.sessionCheckDashboard, adminControllers.showUser);
adminRouter.get("/userState/:id",auth.sessionCheckDashboard, adminControllers.userState);
adminRouter.get("/userStateUn/:id",auth.sessionCheckDashboard, adminControllers.userStateUn);
adminRouter.get("/showProduct",auth.sessionCheckDashboard, adminControllers.showProduct);

adminRouter
  .route("/addProduct")
  .get(auth.sessionCheckDashboard,adminControllers.addProductGet)
  .post(auth.sessionCheckDashboard,upload.array("image"), adminControllers.addProductPost);

adminRouter.delete("/deleteProduct/:_id",auth.sessionCheckDashboard, adminControllers.deleteProduct);
adminRouter.get("/editProductGet/:_id",auth.sessionCheckDashboard, adminControllers.editProductGet);
adminRouter.put(
  "/editProductEdit/:_id",auth.sessionCheckDashboard,
  upload.array("image"),
  adminControllers.editProductEdit
);
adminRouter.get("/showCategory",auth.sessionCheckDashboard, adminControllers.showCategory);
adminRouter.post("/addCategory",auth.sessionCheckDashboard, adminControllers.addCategory);
adminRouter.get("/showBrand",auth.sessionCheckDashboard, adminControllers.showBrand);
adminRouter.post("/addBrand",auth.sessionCheckDashboard, adminControllers.addBrand);
adminRouter.get("/showStock",auth.sessionCheckDashboard, adminControllers.showStock);
adminRouter.post("/addStock/:Id",auth.sessionCheckDashboard, adminControllers.addStock);
adminRouter.post("/moreorder",auth.sessionCheckDashboard,adminControllers.moreorder);
adminRouter.get("/showCoupon",auth.sessionCheckDashboard,adminControllers.showCoupon);
adminRouter.post("/addCoupon",auth.sessionCheckDashboard,adminControllers.addCoupon);
adminRouter.post("/compare",adminControllers.compare);
adminRouter.get("/showBanner",auth.sessionCheckDashboard,adminControllers.showBanner);
adminRouter.post("/addBanner",auth.sessionCheckDashboard,upload.array('image'),adminControllers.addBanner);
adminRouter.post("/bannertDelete",auth.sessionCheckDashboard,adminControllers.bannertDelete);


module.exports = adminRouter;
