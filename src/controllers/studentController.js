const studentModel = require("../models/studentModel");
const {
  isValidRequestBody,
  isValidObjectid,
} = require("../validators/validation");

const student = async function (req, res) {
  try {
    let data = req.body;
    let userId = req.params.userId;
    let { name, subject, marks } = data;

    if (!isValidRequestBody(data)) {
      return res
        .status(400)
        .send({ status: false, message: "kindly send correct request" });
    }

    if (!isValidObjectid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userID is not correct" });
    }

    if (req["decodedToken"].userId != userId) {
      return res.status(400).send({
        status: false,
        message: "Unauthorised user can't add students",
      });
    }

    let isStudentpresent = await studentModel
      .findOne({ name: name, subject: subject })
      .select({ updatedAt: 0, __v: 0, createdAt: 0 });

    if (isStudentpresent) {
      isStudentpresent.marks += marks;
      await isStudentpresent.save();
      return res
        .status(200)
        .send({ status: true, studentdata: isStudentpresent });
    }

    data["userId"] = userId;

    let createStudent = await studentModel.create(data);

    let getStudent = await studentModel
      .findOne(createStudent)
      .select({ updatedAt: 0, __v: 0, createdAt: 0 });
    return res.status(200).send({ status: true, studentdata: getStudent });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const viewStudent = async function (req, res) {
  try {
    let data = req.query;
    let userId = req.params.userId;

    if (!isValidObjectid(userId)) {
      return res.send({
        status: false,
        message: "UserId is not correct or user does not exist",
      });
    }

    //authorization
    if (req["decodedToken"].userId != userId) {
      return res.status(400).send({
        status: false,
        message: "Unauthorised user can't add students",
      });
    }
    data["userId"] = userId;

    let getStudent = await studentModel
      .find(data)
      .select({ updatedAt: 0, __v: 0, createdAt: 0, _id: 0 });

    if (getStudent.length == 0) {
      return res.send({
        status: false,
        message: "Data not found",
      });
    }
    return res.send({ status: true, studentdata: getStudent });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const editStudent = async function (req, res) {
  try {
    let userId = req.params.userId;
    let studentId = req.params.studentId;

    if (!isValidObjectid(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "userId is not correct" });
    }

    if (!isValidObjectid(studentId)) {
      return res
        .status(400)
        .send({ status: false, message: "studentId is not correct" });
    }

    if (req["decodedToken"].userId != userId) {
      return res.status(400).send({
        status: false,
        message: "Unauthorised user can't add students",
      });
    }

    let data = req.body;
    let editData = { isDeleted: false };
    let { name, marks } = data;

    let check = await studentModel.findById(studentId);
    if (!check) {
      return res.status(400).send({
        status: false,
        message: "NO student found with this studentId",
      });
    }

    if (name === check.name) {
      return res.send({
        status: false,
        message: "This name already exists.No need to update",
      });
    }
    editData["name"] = name;

    if (marks === check.marks) {
      return res.send({
        status: false,
        message: "marks are same .No need to update",
      });
    }
    editData["marks"] = marks;

    let edit = await studentModel.findOneAndUpdate(
      { _id: studentId },
      editData,
      { new: true, upsert: true }
    );

    return res
      .status(200)
      .send({ status: true, message: "Data updated", data: edit });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteStudent = async function (req, res) {
  try {
    let userId = req.params.userId;
    let studentId = req.params.studentId;

    if (!isValidObjectid(userId)) {
      return res.send({
        status: false,
        message: "UserId is not correct or user does not exist",
      });
    }

    if (!isValidObjectid(studentId)) {
      return res.send({
        status: false,
        message: "StudentID is not correct",
      });
    }

    let student = await studentModel.findOne({
      _id: studentId,
    });
    if (!student) {
      return res.send({
        status: false,
        message: "Student with this StudentId does not exist",
      });
    }
    if (req["decodedToken"].userId != userId) {
      return res.status(400).send({
        status: false,
        message: "User is not authorised",
      });
    }
    await studentModel.findOneAndUpdate(studentId, {
      isDeleted: true,
    });
    return res.status(200).send({
      status: false,
      message: "Student's Data is deleted",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { student, editStudent, viewStudent, deleteStudent };
