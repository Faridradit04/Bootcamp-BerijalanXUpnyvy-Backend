import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.route";
import counterRoutes from "./routes/counter.route"; 
import { connectRedis } from "./configs/redis.config";
import queueRoutes from "./routes/queue.route";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/counter", counterRoutes);
app.use("/api/queue", queueRoutes); 
app.use(errorHandler);
app.use(errorHandler);
const startServer = async () => {
  try {
    await connectRedis(); 
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to Redis. Server not started.", error);
    process.exit(1);
  }
};
startServer();
export default app;
