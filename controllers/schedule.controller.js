import Schedule from "../models/schedule.model.js";

export const getAllSchedules = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.pageSize) || 10;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Некорректные параметры пагинации",
      });
    }

    const skip = (page - 1) * limit;

    const [total, schedules] = await Promise.all([
      Schedule.countDocuments(),
      Schedule.find()
        .populate("class")
        .populate("schedule.lessons.subject")
        .populate("schedule.lessons.teacher", "fullName")
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: schedules,
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

export const getSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      const error = new Error("Schedule not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};

export const createSchedule = async (req, res, next) => {
  try {
    const newSchedule = await Schedule.create(req.body);
    res.status(201).json({ success: true, data: newSchedule });
  } catch (error) {
    next(error);
  }
};

export const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!schedule) {
      const error = new Error("Schedule not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: schedule });
  } catch (error) {
    next(error);
  }
};
