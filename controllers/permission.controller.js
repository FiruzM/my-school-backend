import Permission from "../models/permission.model.js";
export const getAllPermissions = async (req, res, next) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json({ success: true, data: permissions });
  } catch (error) {
    next(error);
  }
};

export const getPermission = async (req, res, next) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      const error = new Error("Permission not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const { name, key, category } = req.body;

    const permission = await Permission.create({ name, key, category });
    res.status(201).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

export const updatePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: permission });
  } catch (error) {
    next(error);
  }
};
