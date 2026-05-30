import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./utils/db.js";

// ✅ Correct route imports
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";   // ✅ FIXED
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

console.log("SECRET:", process.env.JWT_SECRET);

const app = express();

/* ================= Middleware ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(cookieParser());

/* ================= Routes ================= */

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);       // ✅ Now correct
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

/* ================= Test Route ================= */

app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

/* ================= Server ================= */

const PORT = process.env.PORT || 8000;


app.listen(PORT, async () => {
  await connectDB();
  console.log(` Server running on port ${PORT}`);
});