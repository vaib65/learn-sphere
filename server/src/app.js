import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(
  cors({
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      credentials:true
  })
);

//common middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

//import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"
import userRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middlewares.js";
import courseRouter from "./routes/course.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import lectureRouter from "./routes/lecture.routes.js";
import progressRouter from "./routes/progress.routes.js";

//routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/course", courseRouter)
app.use("/api/v1/enrollment", enrollmentRouter)
app.use("/api/v1/lectures", lectureRouter)
app.use("/api/v1/progress",progressRouter)

//global error handler
app.use(errorHandler)
export {app}