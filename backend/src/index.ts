import express from "express";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import serviceRoutes from "./routes/serviceRoutes";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes);
app.use("/secured/services", serviceRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
