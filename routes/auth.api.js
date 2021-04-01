const express = require("express");
const passport = require("passport");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @route POST api/auth/login
 * @description User can Login with email
 * @access Public
 */
router.post("/login", authController.loginWithEmail);

/**
 * @route POST api/auth/login/google
 * @description User can Login with email
 * @access Public
 */
router.post(
  "/login/google",
  passport.authenticate("google-token", { session: false }),
  authController.loginWithSocial
);

/**
 * @route POST api/auth/login/facebook
 * @description User can Login with email
 * @access Public
 */
router.post(
  "/login/facebook",
  passport.authenticate("facebook-token", { session: false }),
  authController.loginWithSocial
);


module.exports = router;