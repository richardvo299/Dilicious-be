const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      products: [{ 
        name: { type: String, required: true, unique: true },
        // description: { type: String, required: true },
        price: { type: Number, required: true },
        images: [{ imageUrl: { type: String, required: true } }],
        options: [{ option: { type: String, required: true } }],
        toppings: [{ topping: { type: String, required: true } }],
      }],
      promo: { type: Schema.Types.ObjectId, ref: "Promo" },
      status: { type: String, emum: ["pending", "confirmed", "ready", "done"], default: "pending" },
      total: { type: Number, default: 0 },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamp: true }
  );
  orderSchema.plugin(require("./plugins/isDeletedFalse"));

  const Order = mongoose.model("Order", orderSchema);
  module.exports = Order;