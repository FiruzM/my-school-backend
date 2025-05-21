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

export const getRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissionIds");
    res.json(role);
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

export const updateRole = async (req, res) => {
  const { name, description, permissionIds } = req.body;
  if (!req.params.id) return res.status(400).json({ message: "ID не указан" });
  try {
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        permissionIds,
      },
      { new: true }
    );
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    if (!req.params.id)
      return res.status(400).json({ message: "ID не указан" });
    const role = await Role.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
