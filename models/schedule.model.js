import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  schedule: [
    {
      dayOfWeek: {
        type: String,
        enum: ["1", "2", "3", "4", "5", "6"],
        required: true,
      },
      lessons: [
        {
          order: { type: Number }, // Номер урока (1, 2, 3...)
          subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject" },
          teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          room: { type: String }, // Кабинет
        },
      ],
    },
  ],
});

const Schedule = mongoose.model("Schedule", scheduleSchema);
export default Schedule;
