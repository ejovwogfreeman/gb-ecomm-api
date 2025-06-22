const express = require("express");
const router = express.Router();
const imageUpload = require("../middleware/imageUpload");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductImage,
} = require("../controllers/productControllers");

// Routes
router.post("/", imageUpload, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct); // ✅ Get single product
router.put("/:id", imageUpload, updateProduct); // ✅ Update
router.delete("/:id", deleteProduct); // ✅ Delete
router.get("/:id/image", getProductImage);

module.exports = router;
