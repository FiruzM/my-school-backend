import Class from "../models/class.model.js";
import User from "../models/user.model.js";

export const getAllClasses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

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
        .populate({
          path: "subject",
          populate: {
            path: "teacher",
            populate: {
              path: "teacher",
            },
          },
        })
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
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createClass = async (req, res, next) => {
  try {
    const { className, students, subject, teacher } = req.body;

    const extendedStudents = await User.find({
      _id: { $in: subject },
    });

    if (extendedStudents.length !== students.length) {
      return res.status(400).json({ message: "Некоторые ученики не найдены" });
    }

    const newClass = await Class.create({
      className,
      students,
      subject,
      teacher,
    });
    res.status(201).json({ success: true, data: newClass });
  } catch (error) {
    next(error);
  }
};
