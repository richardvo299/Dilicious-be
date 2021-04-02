const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/authentication");
const validators = require("../middlewares/validation");
const { check } = require("express-validator");

//
/**
 * @route GET api/product?page=1&limit=8
 * @description User can see list of all products
 * @access Public
 */
router.get("/", productController.getAllProducts);

/**
 * @route POST api/product/add
 * @description Admin can add product
 * @access Admin Required
 */
router.post(
  "/add",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  validators.validate([
    check("name").notEmpty().withMessage("Name is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("price").notEmpty().withMessage("Price is required"),
    check("images")
      .isArray({ min: 1 })
      .withMessage("At least one image is required"),
    check("categories").notEmpty().withMessage("Categories is required"),
  ]),
  productController.addProduct
);

/**
 * @route PUT api/product/:id/update
 * @description Admin can update product
 * @access Admin required
 */
router.put(
  ":id/update",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.updateProduct
);

/**
 * @description get single product
 */
router.get("/:id", productController.getSingleProduct);

/**
 * @route DELETE api/product/:id/delete
 * @description Admin can delete product
 * @access Admin required
 */
 router.delete(
  "/:id/delete",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.deleteProduct
);

/**
 * @route PUT api/product/:id/update
 * @description Admin can update product
 * @access Admin required
 */
 router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  productController.updateProduct
);

module.exports = router;