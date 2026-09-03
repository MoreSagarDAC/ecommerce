import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./src/config/connectDB.js";
import userRoutes from "./src/routes/users/userRoutes.js";
import CategoryRouter from "./src/routes/category/categoryRoutes.js";
import productRouter from "./src/routes/products/productRoutes.js";
import cartRouter from "./src/routes/cart/cartRoutes.js";
import { requestId } from "./src/middlewares/requestId.middleware.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

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
  }),
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ecommerce API is running",
    processId: process.pid,
    port: process.env.PORT,
  });
});

app.use((req, res, next) => {
  console.log(
    `[REQUEST] PID: ${process.pid} | PORT: ${process.env.PORT} | ${req.method} ${req.originalUrl}`,
  );

  res.setHeader("X-Process-ID", process.pid);
  res.setHeader("X-Node-Port", process.env.PORT || 5000);

  next();
});

//middlewares
app.use(requestId);
app.use(morgan("dev"));
app.use(express.json());
app.use(errorHandler);
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// Routes
app.use("/v1/user", userRoutes);
app.use("/v1/category", CategoryRouter);
app.use("/v1/product", productRouter);
app.use("/v1/cart", cartRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

connectDB();
