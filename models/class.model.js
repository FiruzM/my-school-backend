import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Class = mongoose.model("Class", classSchema);
export default Class;
