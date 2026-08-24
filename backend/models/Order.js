const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
      },
    },

    items: [
      {
        name: String,
        price: Number,
        qty: Number,
        img: String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);