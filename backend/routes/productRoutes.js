const express = require("express");

const productController = require("../controllers/productController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/puertas", auth, productController.puertas);
router.post("/puertas/eco", productController.puertasEco);
router.post("/puertas/media", productController.puertaMediaHerrero);
router.post("/puertas/media/modena", productController.puertaMediaModena);
router.post("/placas", productController.placas);

router.post("/mosquiteros", auth, productController.mosquiteros);
router.post("/mosquiteros/base", productController.mosquiterosBase);
router.post("/mosquiteros/puerta", productController.puertaMosquitera);

router.post("/rajas", productController.rajas);
router.post("/rajas/modena", productController.rajasModena);
router.post("/postigones", productController.postigones);
router.post("/patagonicas", productController.patagonicas);
router.post("/ventanas", productController.ventanas);
router.post("/ventanas/herrero", productController.ventanasHerrero);

router.post("/ventanas_modena", (req, res) => {
  req.body.linea = "modena";
  return productController.ventanas(req, res);
});
router.post("/ventanas_herrero", productController.ventanasHerrero);

module.exports = router;
