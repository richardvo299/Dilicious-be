const express = require('express');
require("dotenv").config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
const passport = require("passport");
const utilsHelper = require("./helpers/utils.helper");
const mongoose = require('mongoose')
const mongoURI = process.env.MONGODB_URI

var indexRouter = require('./routes/index');

require("./middlewares/passport");

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(passport.initialize());

/* DB Connections */
mongoose
  .connect(mongoURI, {
    // some options to deal with deprecated warning
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Mongoose connected to ${mongoURI}`))
  .catch((err) => console.log(err));

app.use("/api", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("404 - Resource not found");
    next(err);
  });

/* Initialize Error Handling */
app.use((err, req, res, next) => {
  console.log("ERROR", err);
  const statusCode = err.message.split(" - ")[0];
  const message = err.message.split(" - ")[1];
  if (!isNaN(statusCode)) {
    utilsHelper.sendResponse(res, statusCode, false, null, { message }, null);
  } else {
    utilsHelper.sendResponse(
      res,
      500,
      false,
      null,
      { message: err.message },
      "Internal Server Error"
    );
  }
});

module.exports = app;
