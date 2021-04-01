const utilsHelper = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { Error } = require("mongoose");
const authController = {};

authController.loginWithEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return next(new Error("401 - Email not exists"));

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("401 - Wrong password"));

    const accessToken = await user.generateToken();
    utilsHelper.sendResponse(
      res,
      200,
      true,
      { user, accessToken },
      null,
      "Successfully logged in"
    );
  } catch (error) {
    next(error);
  }
};

authController.loginWithSocial = async ({ user }, res) => {
  if (user) {
    user = await User.findByIdAndUpdate(
      user._id,
      { new: true }
    );
  } else {
    let newPassword = "" + Math.floor(Math.random() * 100000000);
    const salt = await bcrypt.genSalt(10);
    newPassword = await bcrypt.hash(newPassword, salt);

    user = await User.create({
      name: user.name,
      email: user.email,
      password: newPassword,
    });
  }

  const accessToken = await user.generateToken();
  res.send({ user, accessToken });
};

module.exports = authController;