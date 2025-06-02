import Class from "../models/class.model.js";
import User from "../models/user.model.js";

export const getAllClasses = async (req, res, next) => {
  try {
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

    const [total, classes] = await Promise.all([
      Class.countDocuments(),
      Class.find()
        .populate("teacher")
        .populate("students")
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: classes,
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

export const getClass = async (req, res, next) => {
  try {
    const classId = req.params.id;
    const classItem = await Class.findById(classId)
      .populate("teacher")
      .populate("students");
    if (!classItem) {
      const error = new Error("Class not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: classItem });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const { className, students, teacher } = req.body;

    const extendedStudents = await User.find({
      _id: { $in: students },
    });

    if (extendedStudents.length !== students.length) {
      return res.status(400).json({ message: "Некоторые ученики не найдены" });
    }

    const newClass = await Class.create({
      className,
      students,
      teacher,
    });
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};

export const getClassAutocomplete = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const query = {
      $or: [{ className: { $regex: search, $options: "i" } }],
    };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.pageSize) || 10);
    const skip = (page - 1) * limit;

    const [total, classes] = await Promise.all([
      Class.countDocuments(query),
      Class.find(query).skip(skip).select("_id className").limit(limit).lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: classes.map((classItem) => ({
        id: classItem._id,
        text: classItem.className,
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
