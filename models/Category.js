const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = Schema(
  {
    name: { type: String, required: true, unique: true, trimmed: true, lowercase: true },
    isDeleted: { type: Boolean, default: false}
  },
  { timestamp: true }
);
categorySchema.plugin(require("./plugins/isDeletedFalse"));

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;