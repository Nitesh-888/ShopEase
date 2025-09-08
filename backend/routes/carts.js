import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../middlewares/auth.js";
import Cart from "../models/Cart.js";

const router = express.Router();

// 🔹 Get user's cart
router.get(
  "/",
  protect,
  wrapAsync(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }
    res.json(cart);
  })
);

// 🔹 Add item to cart
router.post(
  "/add",
  protect,
  wrapAsync(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // check if product already in cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      // update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart });
  })
);

// 🔹 Remove item from cart
router.post(
  "/remove",
  protect,
  wrapAsync(async (req, res) => {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      const error = new Error("Cart not found");
      error.status = 404;
      throw error;
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    res.json(cart);
  })
);

export default router;
