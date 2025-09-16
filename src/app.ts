import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware.ts";
import authRoutes from "./routes/auth.route.ts";
import {connectRedis} from "./configs/redis.config.ts";

const app = express();

app.use(express.json());

// connectRedis();
app.use(cors());

app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});