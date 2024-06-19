const User = require('../Models/userModel')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

exports.signUp = async (req, res) => {
  try {
    req.body.role = "user"
    const newUser = await User.create(req.body)
    res.status(201).json({
      message: "Success",
      body: newUser
    })
  } catch (err) {
    console.log(err.message)
    res.status(404).json({
      message: "Error in SignUp of user",
      body: err
    })
  }
}

exports.login = async (req, res) => {
  try {
    const email = req.body.email
    const pass = req.body.password
    if (!email || !pass) {
      return res.status(400).json({
        message: "Please send username and password to the api"
      })
    }

    const user = await User.findOne({ email })
    const isValidPass = await bcrypt.compare(pass, user.password)

    if (isValidPass) {
      res.status(200).json({
        message: "Login Success",
        role: user.role,
        userId: user._id
      })
    } else {
      return res.status(401).json({
        message: "Incorrect Email or password"
      })
    }
  } catch (err) {
    console.log(err.message)
    res.status(404).json({
      message: err.message
    })
  }
}

exports.protect = (req, res, next) => {
  try {
    if (req.session.user) {
      req.user = req.session.user;
    }
    if (!req.user) {
      return res.status(404).json({
        message: "You are not logged in"
      });
    }
  } catch (err) {
    console.log(`okok :${err}`);
    return res.status(404).json({
      message: err
    });
  }
  next();
}

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        console.log("no permission to access this route");
        return res.status(404).json({
          message: "You Dont have permission to access this route"
        });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(404).json({
        message: err
      });
    }
    next();
  };
}
