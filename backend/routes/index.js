const express = require("express");
const estadisticasRoutes = require("./estadisticas.routes");
const authRoutes = require("./authRoutes");
const presupuestoRoutes = require("./presupuestoRoutes");
const productRoutes = require("./productRoutes");
const pdfRoutes = require("./pdfRoutes");
const systemRoutes = require("./system.routes");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/presupuestos", presupuestoRoutes);
router.use("/estadisticas", estadisticasRoutes);
router.use("/pdf", pdfRoutes);
router.use("/system", systemRoutes);
router.use("/", productRoutes);

module.exports = router;
