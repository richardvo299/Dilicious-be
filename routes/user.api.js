const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authentication");

/**
 * @route POST api/user/
 * @description User can register account
 * @access Public
 */
router.post("/", userController.register);

/**
 * @route GET api/user/me
 * @description Return current user info
 * @access Login required
 */
router.get("/me", authMiddleware.loginRequired, userController.getCurrentUser);

/**
 * @route GET api/user/
 * @description Return all users
 * @access Admin required
 */
 router.get(
  "/",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  userController.getAllUsers
);

/**
 * @route GET api/user/:id/order
 * @description Return list orders of current user
 * @access Login Required or Admin authorized
 */
// router.get(
//   "/:id/order",
//   authMiddleware.loginRequired,
//   userController.getCurrentUserOrder,
// );

/**
 * @route Put api/user/:id/payment
 * @description User can make payment
 * @access Login required
 */
// router.put(
//   "/:id/payment",
//   authMiddleware.loginRequired,
//   userController.paymentUserOrder
// );

/**
 * @route Post api/user/cart
 * @description User can check current cart
 * @access Login required
 */
 router.put(
  "/cart",
  authMiddleware.loginRequired,
  userController.addToCart,
);

/**
 * @route Post api/user/cart
 * @description User can delete item from cart
 * @access Login required
 */
 router.put(
  "/cart/delete",
  authMiddleware.loginRequired,
  userController.removeFromCart,
);

module.exports = router;