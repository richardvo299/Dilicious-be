const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    images: [{ imageUrl: { type: String, required: true } }],
    options: [{ option: { type: String, required: true } }],
    toppings: [{ topping: { type: String, required: true} }],
    tags: [{tag: { type: String, required: true }}],
    isDeleted: { type: Boolean, default: false },
    categories: [ { type: Schema.Types.ObjectId, ref: "Category" } ],
    sold: { type: Number },
  },
  { timestamp: true }
);
productSchema.plugin(require("./plugins/isDeletedFalse"));

const Product = mongoose.model("Product", productSchema);
module.exports = Product;