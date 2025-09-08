import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const products = [
  {
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones with 30hr battery life",
    price: 2999,
    category: "electronics",
  },
  {
    name: "Casual T-Shirt",
    description: "100% cotton, comfortable everyday wear",
    price: 499,
    category: "fashion",
  },
  {
    name: "Smartphone",
    description: "Latest model with AMOLED display and fast charging",
    price: 19999,
    category: "electronics",
  },
  {
    name: "Novel Book",
    description: "Bestselling fiction novel of the year",
    price: 350,
    category: "books",
  },
  {
    name: "Sneakers",
    description: "Stylish running shoes with cushioned sole",
    price: 1299,
    category: "fashion",
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // clear old data
    await Product.insertMany(products);
    console.log("Dummy products added ✅");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedProducts();
