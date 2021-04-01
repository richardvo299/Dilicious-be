const express = require("express");
const router = express.Router();
const promoController = require("../controllers/promo.controller");
const authMiddleware = require("../middlewares/authentication");

//
/**
 * @route GET api/promo?page=1&limit=10
 * @description User can see list of all promos
 * @access Public
 */
router.get("/", promoController.getAllPromos);

/**
 * @route POST api/promo/add
 * @description Admin can add promo
 * @access Admin Required
 */
router.post(
  "/add",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  promoController.addPromo
);

/**
 * @route DELETE api/promo/:id/delete
 * @description Admin can delete promo
 * @access Admin required
 */
 router.delete(
  "/:id/delete",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  promoController.deletePromo
);

/**
 * @route PUT api/promo/:id/update
 * @description Admin can update promo
 * @access Admin required
 */
 router.put(
  "/:id/update",
  authMiddleware.loginRequired,
  authMiddleware.adminRequired,
  promoController.updatePromo
);

module.exports = router;