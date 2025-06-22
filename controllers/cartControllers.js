const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne();

    if (!cart) cart = new Cart();

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    await cart.save();
    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to remove from cart", error: err.message });
  }
};

exports.checkoutCart = async (req, res) => {
  try {
    let cart = await Cart.findOne().populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    // ✅ Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // ✅ Create and save the order
    const order = new Order({
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      total,
    });

    await order.save();

    // ✅ Clear cart
    cart.items = [];
    await cart.save();

    res.json({ message: "Checkout successful. Order placed.", order });
  } catch (err) {
    res.status(500).json({ message: "Checkout failed", error: err.message });
  }
};
