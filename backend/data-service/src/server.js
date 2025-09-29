import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import ENV from "./config/env.js";
import Response from "./utils/response.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = ENV.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadPath = ENV.UPLOAD_PATH || './uploads';
app.use('/uploads', express.static(path.resolve(uploadPath)));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Data service is running",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(Response.error(err.message, statusCode));
});

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
});