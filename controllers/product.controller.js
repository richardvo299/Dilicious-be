const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Product = require("../models/Product");
const utilsHelper = require("../helpers/utils.helper");
const Category = require("../models/Category");
//productentication controllers
const productController = {};

//Get all products with filter and query
productController.getAllProducts = async (req, res, next) => {
  try {
    let { page, limit, sortBy, search, category, ...filter } = { ...req.query };
    const keywords = search 
      ? { name: { $regex: search, $options: "i" } } 
      : {};
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 8;
    category = category || null;

    const totalProducts = await Product.count({ ...filter, ...keywords, isDeleted: false });
    console.log("Total products", totalProducts);

    const totalPages = Math.ceil(totalProducts / limit);
    const offset = limit * (page - 1);

    const products = await Product.find({ isDeleted: false, ...keywords })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('categories')

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products, totalProducts, page, totalPages },
      null,
      "Get all products Success"
    );
  } catch (error) {
    next(error);
  }
};

// Get a single product
productController.getSingleProduct = async (req, res, next) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) return next(new Error("401 - Product not found"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product detail found"
    );
  } catch (error) {
    next(error);
  }
};

//Add new product
productController.addProduct = async (req, res, next) => {
  try {
    const { name, description, price, size, images, options, toppings, tags, categories, sold } = req.body;
    
    let product = await Product.findOne({name: req.name});
    if (product) {
      return next(new Error("Product already exists"))
    };

    let categoryIds = [];
    for (let item of categories) {
      let category = await Category.findOne({ name: item});
      if (category) {
        categoryIds.push(category._id);
      }
      else {
        category = await Category.create({ name: item });
        categoryIds.push(category._id);
      }
    }

    const products = await Product.create({
      name,
      description,
      price,
      size,
      images,
      options,
      toppings,
      tags,
      categories: categoryIds,
      sold,
    });
    await products.populate("categories").execPopulate();

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { products },
      null,
      "product created"
    );
  } catch (error) {
    next(error);
  }
};

//admin update product
productController.updateProduct = async (req, res, next) => {
    const productId = req.params.id;
    const { name, description, price, size, images, options, toppings, tags, categories } = req.body;
    let fields = {};

    if (name) fields.name = name;
    if (description) fields.description = description;
    if (price) fields.price = price;
    if (size) fields.size = size;
    if (images) fields.images = images;
    if (options) fields.options = options;
    if (toppings) fields.toppings = toppings;
    if (tags) fields.tags = tags;
    if (categories) fields.categories = categories;
    try {
      const product = await Product.findByIdAndUpdate(
        { _id: productId },
        { $set: fields },
        { new: true }
      );
      if (!product) {
        return next(
          new Error(
            "Product not found or User not authorized",
          )
        );
      }

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Product updated"
    );
  } catch (error) {
    next(error);
  }
};

productController.getSingleProduct = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) return next(new Error("401 - Product not found"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Get detail of single product success"
    );
  } catch (error) {
    next(error);
  }
};

//Delete Product
productController.deleteProduct = async (req, res, next) => {
    const productId = req.params.id;
    try {
    const product = await Product.findByIdAndUpdate(
        { _id: productId },
        { isDeleted: true }
      );
    if (!product) {
      return next(
        new Error(
          "Product not found or User not authorized",
        )
      );
    }
    utilsHelper.sendResponse(res, 200, true, product, null, "Product deleted");
  } catch (error) {
    next(error);
  }
};

module.exports = productController;
