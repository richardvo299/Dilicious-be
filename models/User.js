const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    isDeleted: { type: Boolean, default: false },
    cart: [{ 
      name: { type: String, required: true },
      description: { type: String },
      price: { type: Number, required: true },
      size: { type: String },
      images: { type: String, required: true },
      options: { type: String, required: true },
      toppings: { type: String, required: true },
      quantity: { type: Number, required: true },
      tags: [{tag: { type: String }}],
      categories: [ { type: Schema.Types.ObjectId, ref: "Category" } ],
      sold: { type: Number },
    }],
  },
  { timestamps: true }
);
userSchema.plugin(require("./plugins/isDeletedFalse"));

userSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
  var userObj = new this();
  this.findOne({ email: profile.email }, async function (err, result) {
    if (!result) {
      let newPassword =
        profile.password || "" + Math.floor(Math.random() * 100000000);
      const salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);

      userObj.name = profile.name;
      userObj.email = profile.email;
      userObj.password = newPassword;
      userObj.googleId = profile.googleId;
      userObj.facebookId = profile.facebookId;
      userObj.save(cb);
    } else {
      cb(err, result);
    }
  });
};

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.emailVerified;
  delete obj.emailVerificationCode;
  delete obj.isDeleted;
  return obj;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;