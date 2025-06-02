import Subject from "../models/subject.model.js";

export const getAllSubjects = async (req, res, next) => {
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

    const [total, subjects] = await Promise.all([
      Subject.countDocuments(),
      Subject.find().skip(skip).limit(limit).lean(),
    ]);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: subjects,
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

export const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const getSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);

    if (!subject) {
      const error = new Error("Subject not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    next(error);
  }
};

export const getSubjectsAutocomplete = async (req, res, next) => {
  try {
    const { search = "" } = req.query;

    const query = {
      $or: [{ name: { $regex: search, $options: "i" } }],
    };

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.pageSize) || 10);
    const skip = (page - 1) * limit;

    const [total, subjects] = await Promise.all([
      Subject.countDocuments(query),
      Subject.find(query).skip(skip).select("_id name").limit(limit).lean(),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: subjects.map((subject) => ({
        id: subject._id,
        text: subject.name,
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
