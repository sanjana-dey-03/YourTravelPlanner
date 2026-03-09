require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const tripRoutes = require("./routes/tripRoutes");

require("dotenv").config();

const app = express();

// middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/trip", tripRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// connect mongodb
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});