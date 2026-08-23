const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const items = req.body.items || [];
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const order = await Order.create({ items, total });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Order failed",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
