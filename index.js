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

//middlewares
app.use(morgan("dev"));
app.use(express.json());
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
