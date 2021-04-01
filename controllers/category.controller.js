const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Category = require("../models/Category");
const utilsHelper = require("../helpers/utils.helper");

const categoryController = {};

//Get all Categorys with filter and query
categoryController.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({})
    if (!categories) return next(new Error("401 - Category not found"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories },
      null,
      "Get all categories Success"
    );
  } catch (error) {
    next(error);
  }
};

//Add new category
categoryController.addCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    let category = await Category.findOne({ name: req.body.name.toLowerCase() });
    if (category) {
      return next(new Error("Category already exists"))
    };
    const categories = await Category.create({
      name,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { categories },
      null,
      "Category created"
    );
  } catch (error) {
    next(error);
  }
};

categoryController.getSingleCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
        const category = await Category.findById(categoryId);
        if (!category) return next(new Error("401 - category not found"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { category },
      null,
      "Get detail of single category success"
    );
  } catch (error) {
    next(error);
  }
};

//delete categoryController
categoryController.deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    try {
    const category = await Category.findByIdAndUpdate(
        { _id: categoryId },
        { isDeleted: true }
      );
    if (!category) {
      return next(
        new Error(
          "category not found or User not authorized",
        )
      );
    }
    utilsHelper.sendResponse(res, 200, true, category, null, "category deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = categoryController;
