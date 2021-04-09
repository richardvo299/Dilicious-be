const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User" },
      products: [{ 
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        size: { type: String },
        images: [{ imageUrl: { type: String, required: true } }],
        options: { type: String, required: true },
        toppings: { type: String, required: true },
        quantity: { type: Number, required: true },
        tags: [{tag: { type: String }}],
        categories: [ { type: Schema.Types.ObjectId, ref: "Category" } ],
        sold: { type: Number },
      }],
      checkout: {
        recipientName: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        orderType: { type: String, required: true, enum: ["delivery", "pickup"], default: "delivery"},
        time: { type: String, required: true },
        date: { type: Date, required: true },
      },
      // promo: { type: Schema.Types.ObjectId, ref: "Promo" },
      deliveryFee: { type: Number, required: true, default: 40000},
      status: { type: String, enum: ["pending", "confirmed", "ready", "done"], default: "pending" },
      total: { type: Number, default: 0 },
      isDeleted: { type: Boolean, default: false },
    },
    { timestamp: true }
  );
  orderSchema.plugin(require("./plugins/isDeletedFalse"));

  const Order = mongoose.model("Order", orderSchema);
  module.exports = Order;