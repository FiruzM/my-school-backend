import PermissionCategory from "../models/permissionCategory.model.js";
import Permission from "../models/permission.model.js";
export const getAllCategories = async (req, res) => {
  try {
    const categories = await PermissionCategory.find().populate("permissions");
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const existingPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    if (existingPermissions.length !== permissions.length) {
      return res.status(400).json({ message: "Некоторые права не найдены" });
    }

    const newCategory = PermissionCategory.create({
      name,
      permissions,
    });
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
