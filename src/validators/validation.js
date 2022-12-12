const mongoose = require("mongoose");

const isValidEmail = (email) => {
  return /^([A-Za-z0-9._]{3,}@[A-Za-z]{3,}[.]{1}[A-Za-z.]{2,6})+$/.test(email);
};

const isValidPassword = (password) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
    password
  );
};

const isValidRequestBody = (data) => {
  if (Object.keys(data).length > 0) return true;
  return false;
};

const isValidObjectid = (objectid) => {
  return mongoose.Types.ObjectId.isValid(objectid);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidObjectid,
  isValidRequestBody,
};
