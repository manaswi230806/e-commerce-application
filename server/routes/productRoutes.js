const express = require("express");
const Product = require("../models/product");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {

    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;