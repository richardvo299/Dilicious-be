const bcrypt = require("bcryptjs");
const Order = require("../models/Order");
const Promo = require("../models/Promo");
const utilsHelper = require("../helpers/utils.helper");

const promoController = {};

//Get all Promos with filter and query
promoController.getAllPromos = async (req, res, next) => {
  try {
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalPromos = await Promo.count({ ...filter, isDeleted: false });

    const totalPages = Math.ceil(totalPromos / limit);
    const offset = limit * (page - 1);

    const promos = await Promo.find({ ...keywords })
        .skip(offset)
        .limit(limit);

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { promos, totalPages },
      null,
      "Get all promos Success"
    );
  } catch (error) {
    next(error);
  }
};

//Add new promo
promoController.addPromo = async (req, res, next) => {
  try {
    const { name, description, discount } = req.body;
    let promo = await Promo.findOne({ name: req.body.name.toLowerCase() });
    if (promo) {
      return next(new Error("Promo already exists"))
    };
    const promos = await Promo.create({
      name,
      description,
      discount,
    });
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { promos },
      null,
      "Promo created"
    );
  } catch (error) {
    next(error);
  }
};

promoController.getSinglePromo = async (req, res, next) => {
    const promoId = req.params.id;
    try {
        const promo = await Promo.findById(promoId);
        if (!promo) return next(new Error("401 - promo not found"));

    utilsHelper.sendResponse(
      res,
      200,
      true,
      { promo },
      null,
      "Get detail of single promo success"
    );
  } catch (error) {
    next(error);
  }
};

//delete promoController
promoController.deletePromo = async (req, res, next) => {
    const promoId = req.params.id;
    try {
    const promo = await Promo.findByIdAndUpdate(
        { _id: promoId },
        { isDeleted: true }
      );
    if (!promo) {
      return next(
        new Error(
          "promo not found or User not authorized",
        )
      );
    }
    utilsHelper.sendResponse(res, 200, true, promo, null, "promo deleted");
  } catch (error) {
    next(error);
  }
};

//admin update promo
promoController.updatePromo = async (req, res, next) => {
  const promoId = req.params.id;
  const { name, description, discount } = req.body;
  let fields = {};

  if (name) fields.name = name;
  if (description) fields.description = description;
  if (discount) fields.discount = discount;
  try {
    const promo = await Promo.findByIdAndUpdate(
      { _id: promoId },
      { $set: fields },
      { new: true }
    );
    if (!promo) {
      return next(
        new Error(
          "Promo not found or User not authorized",
        )
      );
    }

  utilsHelper.sendResponse(
    res,
    200,
    true,
    { promo },
    null,
    "Promo updated"
  );
} catch (error) {
  next(error);
}
};

module.exports = promoController;
