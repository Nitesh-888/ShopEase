import express from "express";
import Product from "../models/Product.js";
import wrapAsync from "../utils/wrapAsync.js";
import protect from "../middlewares/auth.js";

const router = express.Router();

// 🔹 Create Product (protected)
router.post(
  "/",
  protect,
  wrapAsync(async (req, res) => {
    const { name, description, price, category } = req.body;
    const product = await Product.create({ name, description, price, category });
    res.status(201).json(product);
  })
);

// 🔹 Get all products (with optional filters)
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const { category, minPrice, maxPrice } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const products = await Product.find(filter);
    res.json(products);
  })
);

// 🔹 Get single product
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res.json(product);
  })
);

// 🔹 Update product (protected)
router.put(
  "/:id",
  protect,
  wrapAsync(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res.json(product);
  })
);

// 🔹 Delete product (protected)
router.delete(
  "/:id",
  protect,
  wrapAsync(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    res.json({ message: "Product deleted successfully ✅" });
  })
);

export default router;
