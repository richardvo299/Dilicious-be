const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const promoSchema = Schema(
  {
    name: { type: String, required: true, unique: true, trimmed: true, lowercase: true },
    description: { type: String },
    discount: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false}
  },
  { timestamp: true }
);
promoSchema.plugin(require("./plugins/isDeletedFalse"));

const Promo = mongoose.model("Promo", promoSchema);
module.exports = Promo;