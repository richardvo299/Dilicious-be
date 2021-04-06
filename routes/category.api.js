const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/authentication");

//
/**
 * @route GET api/category/
 * @description User can see list of all categories
 * @access Public
 */
router.get("/", categoryController.getAllCategories);

/**
 * @route POST api/category/add
 * @description Admin can add category
 * @access Admin Required
 */
router.post(
  "/add",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  categoryController.addCategory
);

/**
 * @route GET api/category/:id
 * @description Get single category
 * @access Admin required
 */
 router.get(
  "/:id",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  categoryController.deleteCategory
);

/**
 * @route DELETE api/category/:id/delete
 * @description Admin can delete category
 * @access Admin required
 */
 router.delete(
  "/:id/delete",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  categoryController.deleteCategory
);

module.exports = router;