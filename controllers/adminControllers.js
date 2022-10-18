const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");

// const homePage = (req, res) => {
//   res.render("adminPages/adminLogin");
// };
const signinPage = (req, res) => {
  res.render("adminPages/adminLogin", { message: req.flash("invalid") });
  // console.log(req.session.username);
};

const signin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });

  if (admin) {
    const validPassword = await bcrypt.compare(password, admin.password);

    if (validPassword) {
      req.session.username = admin.username;
      res.redirect("/admin/dashboard");
    } else {
      req.flash("invalid", "invalid username or password");
      res.redirect("/admin/");
    }
  } else {
    req.flash("invalid", "invalid username or password");
    res.redirect("/admin/");
  }
};

const dashboard = (req, res) => {
  res.render("adminPages/dashbord");
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/");
};

const showorder = (req, res) => {
  res.render("adminPages/order");
};

const showUser = async (req, res) => {
  const showuser = await User.find({}).sort({ firstName: 1 });
  res.render("adminPages/userMng", { showuser });
  // res.render("adminPages/userMng");
};

const showProduct = (req, res) => {
  res.render("adminPages/productMng");
};

const addProductGet = (req, res) => {
  res.render("adminPages/addProduct");
};

const showCategory = async (req, res) => {
  const categorys = await Category.find({});
  res.render("adminPages/categoryMng", {
    message: req.flash("exists"),
    categorys,
  });
};

const addCategory = async (req, res) => {
  const { category } = req.body;

  const newCategory = new Category({
    category,
  });
  try {
    await newCategory.save();
  } catch (error) {
    req.flash("exists", "Category already exists");

    // res.sendStatus(404);
  }
  res.redirect("/admin/showCategory");
};
const showBrand = async (req, res) => {
  const brands = await Brand.find({});
  res.render("adminPages/brandMng", {
    message: req.flash("exists"),
    brands,
  });
};

const addBrand = async (req, res) => {
  const { brand } = req.body;

  const newBrand = new Brand({
    brand,
  });

  try {
    await newBrand.save();
  } catch (error) {
    req.flash("exists", "Brand already exists");

    // res.sendStatus(404);
  }
  res.redirect("/admin/showBrand");
};

exports.signinPage = signinPage;
exports.signin = signin;
exports.dashboard = dashboard;
exports.logout = logout;
exports.showorder = showorder;
exports.showUser = showUser;
exports.showProduct = showProduct;
exports.addProductGet = addProductGet;
exports.showCategory = showCategory;
exports.addCategory = addCategory;
exports.showBrand = showBrand;
exports.addBrand = addBrand;
