const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  checkoutCart,
  getCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
} = require("../controllers/cartControllers");

router.post("/add", upload.none(), addToCart);
router.post("/remove", upload.none(), removeFromCart);
router.post("/increase", upload.none(), increaseCartItemQuantity);
router.post("/decrease", upload.none(), decreaseCartItemQuantity);
router.post("/checkout", checkoutCart);
router.get("/", getCart);

module.exports = router;
