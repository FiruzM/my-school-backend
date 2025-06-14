import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  key: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Permission = mongoose.model("Permission", permissionSchema);
export default Permission;
