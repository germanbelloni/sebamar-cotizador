const path = require("path");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, ".env"), quiet: true });

const apiRoutes = require("./routes");

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);
app.use("/img", express.static(path.join(__dirname, "../frontend/assets/img")));
app.use(
  "/logos",
  express.static(path.join(__dirname, "../frontend/public/logos")),
);
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRoutes);

if (process.env.NODE_ENV !== "test" && process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.info("MongoDB conectado"))
    .catch((err) => console.error("Error conectando MongoDB:", err));
}

module.exports = app;
