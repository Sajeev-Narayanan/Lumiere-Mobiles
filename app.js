const express = require("express");

const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const cors = require("cors");
const dbconfig = require("./config/dbConfig");

const session = require("express-session");

const flash = require("connect-flash");

const methodOverride = require("method-override");

const app = express();

app.use(cors());

const MongoDBStore = require("connect-mongodb-session")(session);

dbconfig();
app.use(function (req, res, next) {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/royalmobiles?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4",
  collection: "sessionValues",
});
store.on("error", function (error) {
  console.log(error);
});
app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));

app.use(express.static("files"));

app.engine("ejs", ejsmate);

const userRoutes = require("./routes/userRouter");

const adminRoutes = require("./routes/adminRouter");

app.use("/users", userRoutes);

app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  res.setHeader("Access-Contol-Allow-Orgin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.get("/", (req, res) => {
  res.render("userpages/home");
});

app.get("*", (req, res, next) => {
  res.send("404, Not found").status(404);
});

app.listen(5000, () => {
  console.log("listening to port 5000 .@@@@@@@👌😍👍😁");
});