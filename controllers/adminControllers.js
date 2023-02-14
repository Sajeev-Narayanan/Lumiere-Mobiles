const bcrypt = require("bcrypt");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const Category = require("../models/categorySchema");
const Brand = require("../models/brandSchema");
const Product = require("../models/productSchema");
const Stock = require("../models/stockSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const Banner = require("../models/bannerSchema");
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
      req.session.adminName = admin.username;
      res.redirect("/admin/dashboard");
    } else {
      req.flash("invalid", "invalid username or password");
      res.redirect("/admin/");
    }
  } else {
    if (username == "adminSanju" && password == "sanjus") {
      req.session.adminName = username;
      res.redirect("/admin/dashboard");
    } else {
      req.flash("invalid", "invalid username or password");
      res.redirect("/admin/");
    }
  }
};

const dashboard = async (req, res) => {
  const orders = await Order.find({ isCompleted: true })
  const users = await User.find({})
  let revenue = 0;
  let delivered = 0;
  let packed = 0;
  let ordered = 0;
  let shipped = 0;
  let cancelled = 0;
  let jan = 0
  feb = 0
  mar = 0
  apr = 0
  may = 0
  jun = 0
  jul = 0
  aug = 0
  sep = 0
  oct = 0
  nov = 0
  dec = 0;
  for (datas of orders) {
    revenue += datas.bill;
    if (datas.orderStatus[0].type == "Delivered") {
      delivered++;
    }
    else if (datas.orderStatus[0].type == "packed") {
      packed++;
    }
    else if (datas.orderStatus[0].type == "ordered") {
      ordered++;
    }
    else if (datas.orderStatus[0].type == "Shipped") {
      shipped++;
    }
    else if (datas.orderStatus[0].type == "cancelled") {
      cancelled++;
    }
    if (datas.createdAt.getMonth() + 1 == 1) { jan++ }
    else if (datas.createdAt.getMonth() + 1 == 2) { feb++ }
    else if (datas.createdAt.getMonth() + 1 == 3) { mar++ }
    else if (datas.createdAt.getMonth() + 1 == 4) { apr++ }
    else if (datas.createdAt.getMonth() + 1 == 5) { may++ }
    else if (datas.createdAt.getMonth() + 1 == 6) { jun++ }
    else if (datas.createdAt.getMonth() + 1 == 7) { jul++ }
    else if (datas.createdAt.getMonth() + 1 == 8) { aug++ }
    else if (datas.createdAt.getMonth() + 1 == 9) { sep++ }
    else if (datas.createdAt.getMonth() + 1 == 10) { oct++ }
    else if (datas.createdAt.getMonth() + 1 == 11) { nov++ }
    else if (datas.createdAt.getMonth() + 1 == 12) { dec++ }


  }

  res.render("adminPages/dashbord", { orders, revenue, users, delivered, packed, ordered, shipped, cancelled, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/admin/");
};

const showorder = async (req, res) => {
  const order = await Order.find({})
  res.render("adminPages/order", { order });
};

const moreorder = async (req, res) => {
  // const { orderId } = req.body;
  const orderId = mongoose.Types.ObjectId(req.body.orderId);
  const orderdetails = await Order.findById({ _id: orderId })
  const productDetails = await Order.aggregate([{ $match: { _id: orderId } }, { $unwind: '$cart_item' }, { $lookup: { from: 'products', localField: 'cart_item.productId', foreignField: '_id', as: 'products' } }])

  res.send({ productDetails })
}

const orderstatus = async (req, res) => {
  let update = false
  const { status } = req.body
  const orderId = mongoose.Types.ObjectId(req.body.orderId);
  try {
    await Order.findByIdAndUpdate(orderId, { $set: { orderStatus: { type: status } } })
    update = true
  } catch (error) {

  }
  res.send({ update })


}

const orderCancel = async (req, res) => {
  let cancel = false;
  const orderId = mongoose.Types.ObjectId(req.body.orderId);
  try {
    await Order.findByIdAndUpdate(orderId, { $set: { orderStatus: { type: "cancelled" } } })
    const orderqt = await Order.findById(orderId)
    for (cartItem of orderqt.cart_item) {
      let qty = cartItem.product_quantity
      let prId = cartItem.productId
      await Stock.findOneAndUpdate({ productId: prId }, { $inc: { stock: qty } })


    }
    cancel = true;
  } catch (error) {
    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
  }
  res.send({ cancel })

}

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

// showProduct############################################################################

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

// add product #############################################################################

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
    finalPrice,
    description,
    deleted,
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
    finalPrice,
    description,
    deleted,
  });

  product.image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  try {
    let productId = product._id
    await Stock.updateOne(
      { productId: productId },
      { $set: { stock: 0, productName: product_name } },
      { upsert: true }
    );
    await product.save();
    res.redirect("/admin/showProduct");
  } catch (error) {
    req.flash("exists", "Product already exists");
    console.log("@@@@@@@@@@@@@@@@@", error);
    res.redirect("/admin/addProduct");
  }
};
// delete product ###############################################################################
const deleteProduct = async (req, res) => {
  const productId = req.params._id;
  // console.log(userId);
  try {
    // await Product.findByIdAndDelete(productId);
    await Product.findByIdAndUpdate(productId, { deleted: true })
    res.redirect("/admin/showProduct");
  } catch (error) { }
};
// edit product start ##################################################################################
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
// ############################################################################################################################
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
    finalPrice,
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
      finalPrice,
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
}

const showCoupon = async (req, res) => {
  const coupon = await Coupon.find({})
  res.render("adminPages/couponMng", { coupon })
}

const addCoupon = async (req, res) => {

  const { couponCode, discount, maxAmount } = req.body;
  let { expire } = req.body
  expire = Number(expire)
  let expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + expire);


  const coupon = new Coupon({
    couponCode,
    discount,
    maxAmount,
    expiryDate
  })
  await coupon.save();

}

const compare = async (req, res) => {
  let dis = ''
  let error = false;
  const { couponCode } = req.body;
  const couponFind = await Coupon.find({ couponCode })
  if (couponFind && couponFind.length > 0) {


    dis = couponFind[0].discount
    const id = couponFind[0]._id
    const maximumLimit = couponFind[0].maxAmount
    const date = new Date()
    const exp = couponFind[0].expiryDate

    if (exp > date) {

      error = true;
      res.send({ dis, id, maximumLimit, error })
    } else {

      await Coupon.findByIdAndDelete(id)
      res.send({ error })
    }
  }
  else {


    res.send({ error })
  }
}

const showBanner = async (req, res) => {
  const banner = await Banner.find({});
  res.render("adminPages/bannerMng", { banner })
}


const addBanner = async (req, res) => {
  const name = req.body.name;
  const banner = new Banner({ name });
  banner.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
  try {
    await banner.save();
    res.redirect("/admin/showBanner")
  } catch (error) {
    console.log(error)
  }

}

const bannertDelete = async (req, res) => {
  let deleted = false;
  const { bannerId } = req.body;

  try {
    await Banner.deleteOne({ _id: bannerId });
    deleted = true
  } catch {
    res.send("error!!!!!!!!!!!!!!!!!!!!!")
  }
  res.send({ deleted })
}



exports.signinPage = signinPage;
exports.signin = signin;
exports.dashboard = dashboard;
exports.logout = logout;
exports.showorder = showorder;
exports.orderstatus = orderstatus;
exports.orderCancel = orderCancel;
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
exports.moreorder = moreorder;
exports.showCoupon = showCoupon;
exports.addCoupon = addCoupon;
exports.compare = compare;
exports.showBanner = showBanner;
exports.addBanner = addBanner;
exports.bannertDelete = bannertDelete;