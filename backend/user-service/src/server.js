import express from "express";
import cors from "cors";
import Response from "./utils/response.js";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import ENV from "./config/env.js";

const app = express();
const PORT = ENV.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "User service is running",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json(Response.error(err.message, statusCode));
});

app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
});
