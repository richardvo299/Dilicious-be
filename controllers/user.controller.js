const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
//user controllers
const userController = {};

userController.register = async (req, res, next) => {
  try {
    let { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) return next(new Error("401 - Email already exists"));

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({ name, email, password, role });

    const accessToken = await user.generateToken();

    utilsHelper.sendResponse(res, 200, true, { user, accessToken }, null, "Created account");
  } catch (error) {
    next(error);
  }
};

//get current user
userController.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    // console.log("you're here");
    const user = await User.findById(userId);
    // console.log("current user", user);
    if (!user) return next(new Error("401 - user not found"));
    utilsHelper.sendResponse(res, 200, true, {user}, null, "get current user success");
} catch (error) {
  next (error);

}
};

// //Get order of current user
// userController.getCurrentUserOrder = async (req, res, next) => {
//   try {
//     const userId = req.userId;
//     const orders = await Order.find({ userId, isDeleted: false })
//       .populate("userId")
//       .populate("products")
//       .sort({ createdAt: -1 });

//     utilsHelper.sendResponse(res, 200, true, { orders }, null, "Current user");
//   } catch (error) {
//     next(error);
//   }
// };

userController.getAllUsers = async (req, res, next) => {
  try {
    const userId = req.userId;
    const users = await User.find({});

    utilsHelper.sendResponse(res, 200, true, { users }, null, "USer List");
  } catch (error) {
    next(error);
  }
};

userController.addToCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    // console.log("req bod", req.body);
    const user = await User.findByIdAndUpdate(userId, { $push: {cart: req.body}}, {new: true});
    // console.log("user", user);
    utilsHelper.sendResponse(res, 200, true, { user }, null, "Item(s) added to user's cart successfully");
  } catch (error) {
    next(error);
  }
};

userController.removeFromCart = async (req, res, next) => {
  try {
    const userId = req.userId;
    // console.log("cart owner", userId);
    // console.log("req to delete", req.body.id);
    const user = await User.findByIdAndUpdate(userId, { $pull: {cart: {_id: req.body.id}}}, {new: true});
    // console.log("user", user);
    utilsHelper.sendResponse(res, 200, true, { user }, null, "Item(s) removed from user's cart successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = userController;