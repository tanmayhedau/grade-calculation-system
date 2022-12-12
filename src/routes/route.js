const express = require("express");
const {
  student,
  editStudent,
  viewStudent,
  deleteStudent,
} = require("../controllers/studentController");
const router = express.Router();
const { register, login } = require("../controllers/userController");
const { authentication } = require("../middlewares/auth");

router.post("/register", register);

router.post("/login", login);

router.post("/student/:userId", authentication, student);

router.put("/student/:userId/:studentId", authentication, editStudent);

router.get("/student/:userId", authentication, viewStudent);

router.delete("/student/:userId/:studentId", authentication, deleteStudent);

module.exports = router;
