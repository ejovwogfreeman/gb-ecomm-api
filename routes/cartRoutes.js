const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  checkoutCart,
} = require("../controllers/cartControllers");

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/checkout", checkoutCart);

module.exports = router;
