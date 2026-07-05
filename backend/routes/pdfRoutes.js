const express = require("express");

const auth = require("../middleware/auth");
const pdfController = require("../controllers/pdfController");

const router = express.Router();

router.post("/preview", auth, pdfController.preview);

module.exports = router;
