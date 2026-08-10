import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./src/config/connectDB.js";
import userRoutes from "./src/routes/users/userRoutes.js";
import CategoryRouter from "./src/routes/category/categoryRoutes.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS configuration - allows all origins
app.use(
  cors({
    origin: true,
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Routes
app.use("/users/v1", userRoutes);
app.use("/category/v1", CategoryRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

connectDB();
