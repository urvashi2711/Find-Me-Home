const express = require("express");

const productsController = require("../controllers/products.controller");
const protectRoutesMiddleware = require("../middlewares/protect-routes");
const router = express.Router();

router.get(
  "/products",
  protectRoutesMiddleware,
  productsController.getAllProducts
);

router.get(
  "/products/:id",
  protectRoutesMiddleware,
  productsController.getProductDetails
);

module.exports = router;
