const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: ObjectId,
      ref: "user1",
    },
    subject: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("student1", studentSchema);
