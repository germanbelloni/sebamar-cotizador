const express = require("express");

const authRoutes = require("./authRoutes");
const presupuestoRoutes = require("./presupuestoRoutes");
const productRoutes = require("./productRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/presupuestos", presupuestoRoutes);
router.use("/", productRoutes);

module.exports = router;
