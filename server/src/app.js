import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(
  cors({
      origin: process.env.CLIENT_URL | "http://localhost:5173",
      credentials:true
  })
);

//common middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser)

//import routes
import healthCheckRouter from "./routes/healthCheck.routes.js"

//routes
app.use("/api/v1/healthcheck",healthCheckRouter)

//global error handler

export {app}