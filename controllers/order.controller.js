const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const utilsHelper = require("../helpers/utils.helper");

const { validationResult, check } = require("express-validator");
const validator = require("../middlewares/validation");
const { Error } = require("mongoose");

let orderController = {};

//Create the order
orderController.createOrder = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { products, checkout, deliveryFee, status, total } = req.body;
    validator.checkObjectId(userId);
    // products.map((p) => validator.checkObjectId(p));

    if (products && products.length === 0) {
      return next(new Error("No products added."));
    }

    const productList = [];
    console.log("List of product", products);
    console.log("products length", products.length);
    let totalBeforeCharge = 0;
    let totalBe = 0;
    let fee = 40000;
    for (let i = 0; i < products.length; i++) {
      console.log("product n", products[i]);      
      totalBeforeCharge += products[i].quantity * products[i].price;
      console.log("Total before delivery", totalBeforeCharge);
      productList.push(products[i]);
    }

    if (totalBeforeCharge > 500000 || checkout.orderType == "pickup") {
      fee = 0;
    } else {fee = 40000}

    totalBe = totalBeforeCharge + fee;

    const order = await Order.create({
        userId,
        products: productList,
        checkout,
        deliveryFee: fee,
        status,
        total: totalBe,
    });''
    utilsHelper.sendResponse(res, 200, true, { order }, null, "Order created");
  } catch (error) {
    next(error);
  }
};

//Get detail of an order by its ID
orderController.getDetailOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("products")
      .populate("userId");
    if (!order) return next(new Error("401- Order not found"));
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { order },
      null,
      "get detail order success"
    );
  } catch (error) {
    next(error);
  }
};
//Update Order
orderController.updateOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { userId, products, status, total } = req.body;
    let fields = {};
    if (products) fields.products = products;
    if (status) fields.status = status;
    if (total) fields.total = total;

    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { $set: fields },
      { new: true }
    );
    if (!order) {
      return next(new Error("Order not found or User not authorized"));
    }
    utilsHelper.sendResponse(res, 200, true, { order }, null, "order send");
  } catch (error) {
    next(error);
  }
};
//

//delete order
orderController.deleteOrder = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { userId, products, status, total } = req.body;

    const order = await Order.findByIdAndUpdate(
      { _id: orderId },
      { isDeleted: true },
      { new: true }
    );
    
    if (!order) {
      return next(new Error("order not found or User not authorized"));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = orderController;