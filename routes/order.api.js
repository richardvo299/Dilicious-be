const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication");
const orderController = require("../controllers/order.controller");

/**
 * @route POST api/order/
 * @description User can create order
 * @access Login require
 */
router.post("/", authMiddleware.loginRequired, orderController.createOrder);

/**
 * @route POST api/order
 * @description User can update order
 * @access Login require
 */
router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  orderController.updateOrder
);

/**
 * @route POST api/order
 * @description User can see order detail
 * @access Login required
 */
router.get(
  "/:id",
  authMiddleware.loginRequired,
  orderController.getDetailOrder,
);


/**
 * @route POST api/order
 * @description Admin can delete order
 * @access Admin required
 */
router.delete(
  "/:id/delete",
  authMiddleware.loginRequired,
  orderController.deleteOrder,
);

module.exports = router;