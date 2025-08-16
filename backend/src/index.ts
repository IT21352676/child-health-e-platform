import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.use("/appointment", require("./routes/appointmentRoutes"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
