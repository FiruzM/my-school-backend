import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "user name is required"],
      trim: true,
      minLength: [3, "user name must be at least 3 characters"],
      maxLength: [50, "user name must be at most 100 characters"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [
        /^([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+)\.([a-zA-Z0-9-.]+)$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password be at least 3 characters"],
    },
    gender: { type: String, enum: ["male", "female"] },
    birthYear: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (v) {
          // Проверяем, что строка соответствует формату ISO и является валидной датой
          return (
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(v) &&
            !isNaN(new Date(v).getTime())
          );
        },
        message: (props) =>
          `${props.value} не является валидной датой в формате ISO!`,
      },
    },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", required: true },
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

userSchema.index({ fullName: 1, email: 1 });
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};
const User = mongoose.model("User", userSchema);
export default User;
