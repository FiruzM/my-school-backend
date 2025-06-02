import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import connectToDatabase from "./database/mongodb.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { arcjetMiddleware } from "./middlewares/arcjet.middleware.js";
import permissionRouter from "./routes/permission.routes.js";
import permissionCategoryRouter from "./routes/permissionCategory.routes.js";
import roleRouter from "./routes/role.routes.js";
import cors from "cors";
import subjectRoute from "./routes/subject.routes.js";
import classRouter from "./routes/class.routes.js";
import scheduleRouter from "./routes/schedule.routes.js";

const app = express();
// Настройки CORS
const corsOptions = {
  origin: [
    "http://localhost:3000", // Для разработки
    "https://your-production-domain.com", // Для продакшена
  ],
  credentials: true, // Разрешаем передачу кук и заголовков авторизации
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/permissions-categories", permissionCategoryRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/subjects", subjectRoute);
app.use("/api/v1/classes", classRouter);
app.use("/api/v1/schedules", scheduleRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  console.log("Server is running on port " + PORT);

  await connectToDatabase();
});
