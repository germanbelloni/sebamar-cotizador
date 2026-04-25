const path = require("path");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

const apiRoutes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/img", express.static(path.join(__dirname, "../frontend/assets/img")));
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

if (process.env.NODE_ENV !== "test" && process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.error("Error conectando MongoDB:", err));
}

module.exports = app;
