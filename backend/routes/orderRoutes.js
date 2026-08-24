const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      items = [],
      customer,
      paymentMethod = "cash",
    } = req.body;

    if (!items.length) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    if (
      !customer ||
      !customer.name ||
      !customer.email ||
      !customer.phone ||
      !customer.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Customer details are required",
      });
    }

    const total = items.reduce(
      (sum, item) =>
        sum + Number(item.price) * Number(item.qty),
      0
    );

    const order = await Order.create({
      customer,
      items,
      total,
      paymentMethod,
      status: "pending",
    });

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
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    res.json(orders);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not load orders",
      error: error.message,
    });
  }
});

module.exports = router;