const express = require("express");

const router = express.Router();

const {
  getSystemStatus,
  updateMaintenance,
} = require("../controllers/systemController");

const auth = require("../middleware/auth");
const rolesPermitidos = require("../middleware/rolesPermitidos");

router.get("/status", auth, getSystemStatus);

router.patch(
  "/maintenance",
  auth,
  rolesPermitidos("superadmin"),
  updateMaintenance,
);

module.exports = router;
