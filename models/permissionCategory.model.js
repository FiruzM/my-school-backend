import mongoose from "mongoose";

const permissionCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
    },
  ],
});

const PermissionCategory = mongoose.model(
  "PermissionCategory",
  permissionCategorySchema
);
export default PermissionCategory;
