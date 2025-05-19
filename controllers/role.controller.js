import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissionIds");
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createRole = async (req, res) => {
  const { name, description, permissionIds } = req.body;

  try {
    const existingPermissions = await Permission.find({
      _id: { $in: permissionIds },
    });

    if (existingPermissions.length !== permissionIds.length) {
      return res.status(400).json({ message: "Некоторые права не найдены" });
    }

    const newRole = Role.create({
      name,
      description,
      permissionIds,
    });
    res.status(201).json({ success: true, data: newRole });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissionIds");
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
