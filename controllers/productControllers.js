const Product = require("../models/productModel");

// CREATE Product (already implemented)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "Image is required" });

    const product = new Product({
      name,
      description,
      category,
      price,
      image: {
        data: file.buffer,
        contentType: file.mimetype,
      },
    });

    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

// GET All Products (already implemented)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}, { image: 0 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// ✅ GET Single Product by ID
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id, { image: 0 });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving product" });
  }
};

// ✅ UPDATE Product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, category, price } = req.body;
    const file = req.file;

    const updateData = {
      name,
      description,
      category,
      price,
    };

    if (file) {
      updateData.image = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

// ✅ DELETE Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: err.message });
  }
};

// GET Product Image (already implemented)
exports.getProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.image || !product.image.data) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.contentType(product.image.contentType);
    res.send(product.image.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving image" });
  }
};
