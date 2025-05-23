import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Название предмета (например, "Математика")
});

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
