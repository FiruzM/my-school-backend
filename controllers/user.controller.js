import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const { search = "", roleId = "" } = req.query;

    const query = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    if (roleId) {
      if (!mongoose.Types.ObjectId.isValid(roleId)) {
        return res.status(400).json({ message: "Неверный формат ID роли" });
      }

      query.roleId = new mongoose.Types.ObjectId(roleId);
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;

    // Валидация параметров
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Некорректные параметры пагинации",
      });
    }

    // Вычисляем смещение
    const skip = (page - 1) * limit;

    // Запрашиваем данные с пагинацией
    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).populate("role").skip(skip).limit(limit).lean(),
    ]);

    // Рассчитываем общее количество страниц
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: "role",
        populate: {
          path: "permissionIds",
        },
      })
      .populate("subjects")
      .select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, birthYear } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    if (!isValidISODate(birthYear)) {
      return res.status(400).json({
        message:
          "Некорректный формат даты. Используйте ISO строку (toISOString())",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      ...req.body,
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { password, name, email, birthYear, role } = req.body;
    if (!req.params.id)
      return res.status(400).json({ message: "ID не указан" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        birthYear,
        role,
        ...(password.length > 0 ? { password: hashedPassword } : {}),
      },
      {
        new: true,
        upsert: false,
      }
    );
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUserAutocomplete = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const query = {
      $or: [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.pageSize) || 10);
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      User.countDocuments(query),
      User.find(query).skip(skip).select("_id fullName").limit(limit).lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: users.map((user) => ({
        id: user._id,
        text: user.fullName,
      })),
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req, res, next) => {
  if (!req.params.id) return res.status(400).json({ message: "ID не указан" });
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
function isValidISODate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toISOString() === dateString;
  } catch {
    return false;
  }
}
