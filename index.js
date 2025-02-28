import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import express from "express";
import cors from "cors";
import { logger } from "./utils/logger.js";
import connectDB from "./config/db.config.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ResponseHandler from "./utils/responseHandler.js";

const app = express();

const whitelist = process.env.WHITE_LIST;

//* Middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      logger.info(`Origin: ${origin}`);
      if (!origin) {
        return callback(null, true);
      }
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  })
);

app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

//* Routes
app.get("/", (req, res) => {
  return ResponseHandler.success(res, "API is running");
});

import testRoutes from "./routers/testRoutes.js";
app.use("/api/v1", testRoutes);

import authRoutes from "./routers/authRoutes.js";
app.use("/api/v1/auth", authRoutes);

import userRoutes from "./routers/userRouter.js";
app.use("/api/v1/user", userRoutes);

import projectRoutes from "./routers/projectRoutes.js";
app.use("/api/v1/project", projectRoutes);

import serviceRoutes from "./routers/serviceRoutes.js";
app.use("/api/v1/service", serviceRoutes);

import projectTypeDescRoutes from "./routers/projectTypeDescRoutes.js";
app.use("/api/v1/projectTypeDesc", projectTypeDescRoutes);

//* Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// NOTE: Handling the unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Shutting the server down: ${err.message}`.red);
  // NOTE: Closing the server and exiting the process
  server.close(() => process.exit(1));
});

// NOTE: Handling the unhandled exceptions
process.on("uncaughtException", (err, promise) => {
  console.log(`Shutting the server down: ${err.message}`.red);
  // NOTE: Closing the server and exiting the process
  server.close(() => process.exit(1));
});

// NOTE: Route not found middleware
app.use((req, res, next) => {
  next(ResponseHandler.error(res, "Route not found", 404));
});
