const mongoose = require("mongoose");
const validator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
    trim: true,
  },
  type: { type: String, required: true, trim: true },
});
adminSchema.plugin(validator);
const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
