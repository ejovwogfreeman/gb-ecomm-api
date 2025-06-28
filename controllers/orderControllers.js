// 📁 controllers/orderController.js
const Order = require("../models/orderModel");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate({
      path: "items.product",
      select: { image: 0 }, // 👈 exclude image using object syntax
    });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate({
      path: "items.product",
      select: { image: 0 }, // 👈 exclude image using object syntax
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch order", error: err.message });
  }
};
