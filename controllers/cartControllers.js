const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// exports.addToCart = async (req, res) => {
//   try {
//     console.log("Incoming body:", req.body);

//     const { productId } = req.body;
//     let { quantity } = req.body;

//     if (!productId) {
//       return res.status(400).json({ message: "Product ID is required" });
//     }

//     // ✅ Default quantity to 1 if not provided or invalid
//     quantity = Number(quantity);
//     if (!quantity || isNaN(quantity) || quantity <= 0) {
//       quantity = 1;
//     }

//     let cart = await Cart.findOne();
//     if (!cart) cart = new Cart();

//     const existingItem = cart.items.find(
//       (item) => item.product.toString() === productId
//     );

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       cart.items.push({ product: productId, quantity });
//     }

//     await cart.save();

//     res.json({ message: "Item added to cart", cart });
//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to add to cart",
//       error: err.message,
//     });
//   }
// };

exports.addToCart = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { productId } = req.body;
    let { quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // ✅ Default quantity to 1 if not provided or invalid
    quantity = Number(quantity);
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      quantity = 1;
    }

    let cart = await Cart.findOne();
    if (!cart) cart = new Cart();

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    // ✅ If item already exists, return early
    if (existingItem) {
      return res.status(200).json({
        message: "Item already in cart",
        cart,
      });
    }

    // Otherwise, add new item
    cart.items.push({ product: productId, quantity });

    await cart.save();

    res.json({ message: "Item added to cart", cart });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add to cart",
      error: err.message,
    });
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

exports.increaseCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity += 1;
    await cart.save();

    res.json({ message: "Item quantity increased", cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to increase quantity", error: err.message });
  }
};

exports.decreaseCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let cart = await Cart.findOne();
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // ✅ Prevent going below 1
    if (item.quantity > 1) {
      item.quantity -= 1;
      await cart.save();
      return res.json({ message: "Item quantity decreased", cart });
    } else {
      return res.status(400).json({ message: "Minimum quantity is 1" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to decrease quantity", error: err.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate({
      path: "items.product",
      select: { image: 0 }, // 👈 exclude image using object syntax
    });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    res.json({ cart });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: err.message });
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
