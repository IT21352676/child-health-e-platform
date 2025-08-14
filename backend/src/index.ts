import { exec } from "child_process";
import { promisify } from "util";
import express from "express";
import cors from "cors";
import { AuthType, ProxyFormat } from "@torchlabs/proxy-utils/lib/@types";
import authRoutes from "./auth";
import authMiddleware from "./middleware";
import * as dotenv from "dotenv";

import bcrypt from "bcryptjs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(process.env.BACKEND_PORT, () => {
  console.log(
    `✅ Server running on http://localhost:${process.env.BACKEND_PORT}`
  );
});
