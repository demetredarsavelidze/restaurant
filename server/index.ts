import cors from "cors";
import "dotenv/config";
import express from "express";
import { authRoutes } from "./routes/authRoutes.js";
import { menuRoutes } from "./routes/menuRoutes.js";
import { reservationRoutes } from "./routes/reservationRoutes.js";
import { tableRoutes } from "./routes/tableRoutes.js";
import { testimonialRoutes } from "./routes/testimonialRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "restaurant-reservation-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Restaurant API running on http://localhost:${port}`);
});
