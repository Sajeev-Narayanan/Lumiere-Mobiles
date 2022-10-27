const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Stock = require("../models/stockSchema");
const { cloudinary } = require("../cloudinary");
const mongoose = require("mongoose");

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
const userState = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { state: false });
  res.redirect("/admin/showUser");
};
const userStateUn = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(id, { state: true });
  res.redirect("/admin/showUser");
};

const showProduct = async (req, res) => {
  const productFind = await Product.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brand_id",
        foreignField: "_id",
        as: "brand",
      },
    },
  ]);
  res.render("adminPages/productMng", { productFind });
};

const addProductGet = async (req, res) => {
  const brand = await Brand.find({});
  const category = await Category.find({});
  res.render("adminPages/addProduct", {
    brand,
    category,
    message: req.flash("exists"),
  });
};

const addProductPost = async (req, res) => {
  const {
    product_name,
    category_id,
    brand_id,
    ram,
    memory,
    battery,
    price,
    discount,
    description,
  } = req.body;

  const product = new Product({
    product_name,
    category_id,
    brand_id,
    ram,
    memory,
    battery,
    price,
    discount,
    description,
  });

  product.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  try {
    await product.save();
    res.redirect("/admin/showProduct");
  } catch (error) {
    req.flash("exists", "Product already exists");
    // console.log(error);
    res.redirect("/admin/addProduct");
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params._id;
  // console.log(userId);
  try {
    await Product.findByIdAndDelete(productId);
    res.redirect("/admin/showProduct");
  } catch (error) {}
};
// edit product start ###########################################
const editProductGet = async (req, res) => {
  const product = await Product.findById(req.params._id);
  const uid = product._id;

  const categorylook = await Product.aggregate([
    {
      $match: {
        _id: uid,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category_id",
        foreignField: "_id",
        as: "category",
      },
    },
  ]);
  const brandlook = await Product.aggregate([
    {
      $match: {
        _id: uid,
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brand_id",
        foreignField: "_id",
        as: "brand",
      },
    },
  ]);
  // console.log(brandLookup)
  const brandFind = await Brand.find({});
  const categoryFind = await Category.find({});
  res.render("adminPages/editProduct", {
    product,
    categorylook,
    categoryFind,
    brandlook,
    brandFind,
  });
};

const editProductEdit = async (req, res) => {
  const phots = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  const {
    product_name,
    category_id,
    brand_id,
    ram,
    memory,
    battery,
    price,
    discount,
    description,
  } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(req.params._id, {
      product_name,
      category_id,
      brand_id,
      ram,
      memory,
      battery,
      price,
      discount,
      description,
    });

    product.image.push(...phots);
    product.save();

    if (req.body.deleteImages) {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await product.updateOne({
        $pull: { image: { filename: { $in: req.body.deleteImages } } },
      });
    }
    res.redirect("/admin/showProduct");
  } catch (err) {
    console.log(err._message);
  }
};
// edit product end ################################################
const showCategory = async (req, res) => {
  const categorys = await Category.find({});
  // const product = await Product.find({}, { category_id: 1, _id: 0 });
  // console.log(product);
  console.log(categorys);
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

const showStock = async (req, res) => {
  const product = await Product.find({});
  const stock = await Stock.find({});
  res.render("adminPages/stockMng", { product, stock });
};

const addStock = async (req, res) => {
  const { Id } = req.params;
  const { productName, stock } = req.body;

  try {
    await Stock.updateOne(
      { productId: Id },
      { $set: { stock: stock, productName: productName } },
      { upsert: true }
    );

    // await stocks.save();
    res.redirect("/admin/showStock");
  } catch (error) {
    console.log(error);
  }
};

exports.signinPage = signinPage;
exports.signin = signin;
exports.dashboard = dashboard;
exports.logout = logout;
exports.showorder = showorder;
exports.showUser = showUser;
exports.userState = userState;
exports.userStateUn = userStateUn;
exports.showProduct = showProduct;
exports.addProductGet = addProductGet;
exports.addProductPost = addProductPost;
exports.deleteProduct = deleteProduct;
exports.editProductGet = editProductGet;
exports.editProductEdit = editProductEdit;
exports.showCategory = showCategory;
exports.addCategory = addCategory;
exports.showBrand = showBrand;
exports.addBrand = addBrand;
exports.showStock = showStock;
exports.addStock = addStock;
