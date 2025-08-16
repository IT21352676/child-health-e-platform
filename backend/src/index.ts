import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/secured/services", serviceRoutes);
app.use("/secured", appointmentRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
