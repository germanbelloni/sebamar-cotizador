const express = require("express");

const authRoutes = require("./authRoutes");
const presupuestoRoutes = require("./presupuestoRoutes");
const productRoutes = require("./productRoutes");
const pdfRoutes = require("./pdfRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/presupuestos", presupuestoRoutes);
router.use("/pdf", pdfRoutes);
router.use("/", productRoutes);

module.exports = router;
