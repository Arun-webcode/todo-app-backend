import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoutes.js"
import taskRoute from "./routes/taskRoutes.js"

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
    origin: "http://localhost:4200",
    credentials: true,
};
app.use(cors(corsOption));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/tasks", taskRoute);


// Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send("Something went wrong!");
// });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running at port ${PORT}`);
});
