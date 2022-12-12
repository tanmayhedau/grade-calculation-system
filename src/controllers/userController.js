const userModel = require("../models/userModel");
const { isValidEmail, isValidPassword } = require("../validators/validation");
const jwt = require("jsonwebtoken");
const studentModel = require("../models/studentModel");

const register = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "enter email or password" });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "invalid email" });
    }

    let users = await userModel.findOne({ email: email });
    if (users) {
      return res
        .status(400)
        .send({ status: false, message: "already registered , please login" });
    }

    if (password && !isValidPassword(password)) {
      return res.status(400).send({
        status: false,
        message:
          "Password must contain 8-15 characters, and atleast one uppercase, one special character, one number!",
      });
    }

    let createUser = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "user registered", data: createUser });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const login = async function (req, res) {
  try {
    let data = req.body;
    const { email, password } = data;
    if (!email || !password) {
      return res
        .status(400)
        .send({ status: false, message: "enter email or password" });
    }
    if (email && !isValidEmail(email)) {
      return res.status(400).send({ status: false, message: "invalid email" });
    }
    if (password && !isValidPassword(password)) {
      return res
        .status(400)
        .send({ status: false, message: "invalid password" });
    }

    let user = await userModel.findOne({ email: email, password: password });
    if (!user) {
      return res.status(404).send({ status: false, message: "user not found" });
    }

    let token = jwt.sign(
      {
        userId: user._id,
      },
      "plutonium"
    );

    let studentList = await studentModel.find({ userId: user._id });
    if (studentList.length === 0) {
      return res
        .status(400)
        .send({
          status: false,
          token: token,
          message: "No such student logged in",
        });
    }

    return res
      .status(200)
      .send({ status: true, token: token, studentList: studentList });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { register, login };
