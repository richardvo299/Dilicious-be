const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require("../models/User");
const mongoose = require("mongoose");
const authController = require("../controllers/auth.controller");

const authMiddleware = {};

authMiddleware.loginRequired = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) return next(new Error("401 - Access Token required"));
    const accessToken = tokenString.replace("Bearer ", "");

    jwt.verify(accessToken, JWT_SECRET_KEY, (err, payload) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return next(new Error("401 - Access token expired"));
        } else {
          return next(new Error("401 - Access token is invalid"));
        }
      }

      req.userId = payload._id;
    });
    next();
  } catch (error) {
    next(error);
  }
};

authMiddleware.adminRequired = async (req, res, next) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);
    console.log("current user", currentUser)
    if (!currentUser) return next(new Error("401 - User not found"));

    const isAdmin = currentUser.role === "admin";
    if (!isAdmin) return next(new Error("401- Admin required"));
    req.isAdmin = isAdmin;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;