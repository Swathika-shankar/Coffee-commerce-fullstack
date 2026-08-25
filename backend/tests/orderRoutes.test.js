const express = require("express");
const request = require("supertest");

const Order = require("../models/Order");
const orderRoutes = require("../routes/orderRoutes");

jest.mock("../models/Order");

const app = express();

app.use(express.json());
app.use("/api/orders", orderRoutes);

describe("Order API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // POST /api/orders
  // ==========================================

  describe("POST /api/orders", () => {
    test("creates a customer order successfully", async () => {
      const orderData = {
        customer: {
          name: "Test Customer",
          email: "customer@example.com",
          phone: "07123456789",
          address: "10 Test Street, Wolverhampton",
        },
        items: [
          {
            name: "Cappuccino",
            price: 8,
            qty: 2,
            img: "assets/images/product-1.png",
          },
          {
            name: "Latte",
            price: 9,
            qty: 1,
            img: "assets/images/product-2.png",
          },
        ],
        paymentMethod: "cash",
      };

      const savedOrder = {
        _id: "order123",
        ...orderData,
        total: 25,
        status: "pending",
      };

      Order.create.mockResolvedValue(savedOrder);

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Order placed successfully"
      );
      expect(response.body.order).toEqual(savedOrder);

      expect(Order.create).toHaveBeenCalledWith({
        customer: orderData.customer,
        items: orderData.items,
        total: 25,
        paymentMethod: "cash",
        status: "pending",
      });
    });

    test("calculates the order total on the server", async () => {
      const orderData = {
        customer: {
          name: "Test Customer",
          email: "customer@example.com",
          phone: "07123456789",
          address: "10 Test Street",
        },
        items: [
          {
            name: "Latte",
            price: 9,
            qty: 3,
          },
          {
            name: "Espresso",
            price: 7,
            qty: 2,
          },
        ],
        paymentMethod: "card",
      };

      Order.create.mockImplementation(async (data) => ({
        _id: "order456",
        ...data,
      }));

      const response = await request(app)
        .post("/api/orders")
        .send(orderData);

      expect(response.statusCode).toBe(201);

      // (9 × 3) + (7 × 2) = 41
      expect(response.body.order.total).toBe(41);

      expect(Order.create).toHaveBeenCalledWith(
        expect.objectContaining({
          total: 41,
        })
      );
    });

    test("returns 400 when the cart is empty", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: {
            name: "Test Customer",
            email: "customer@example.com",
            phone: "07123456789",
            address: "10 Test Street",
          },
          items: [],
          paymentMethod: "cash",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Cart is empty");

      expect(Order.create).not.toHaveBeenCalled();
    });

    test("returns 400 when customer details are missing", async () => {
      const response = await request(app)
        .post("/api/orders")
        .send({
          items: [
            {
              name: "Latte",
              price: 9,
              qty: 1,
            },
          ],
          paymentMethod: "cash",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Customer details are required"
      );

      expect(Order.create).not.toHaveBeenCalled();
    });

    test("returns 400 when order creation fails", async () => {
      Order.create.mockRejectedValue(
        new Error("Database validation error")
      );

      const response = await request(app)
        .post("/api/orders")
        .send({
          customer: {
            name: "Test Customer",
            email: "customer@example.com",
            phone: "07123456789",
            address: "10 Test Street",
          },
          items: [
            {
              name: "Espresso",
              price: 7,
              qty: 1,
            },
          ],
          paymentMethod: "cash",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Order failed");
      expect(response.body.error).toBe(
        "Database validation error"
      );
    });
  });

  // ==========================================
  // GET /api/orders
  // ==========================================

  describe("GET /api/orders", () => {
    test("returns all customer orders", async () => {
      const mockOrders = [
        {
          _id: "order1",
          customer: {
            name: "Customer One",
          },
          items: [
            {
              name: "Latte",
              price: 9,
              qty: 1,
            },
          ],
          total: 9,
          paymentMethod: "cash",
          status: "pending",
        },
        {
          _id: "order2",
          customer: {
            name: "Customer Two",
          },
          items: [
            {
              name: "Cappuccino",
              price: 8,
              qty: 2,
            },
          ],
          total: 16,
          paymentMethod: "card",
          status: "pending",
        },
      ];

      const sortMock = jest
        .fn()
        .mockResolvedValue(mockOrders);

      Order.find.mockReturnValue({
        sort: sortMock,
      });

      const response = await request(app)
        .get("/api/orders");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockOrders);

      expect(Order.find).toHaveBeenCalled();

      expect(sortMock).toHaveBeenCalledWith({
        createdAt: -1,
      });
    });

    test("returns 500 when orders cannot be loaded", async () => {
      const sortMock = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      Order.find.mockReturnValue({
        sort: sortMock,
      });

      const response = await request(app)
        .get("/api/orders");

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Could not load orders"
      );
    });
  });

  // ==========================================
  // DELETE /api/orders/:id
  // ==========================================

  describe("DELETE /api/orders/:id", () => {
    test("deletes an order successfully", async () => {
      Order.findByIdAndDelete.mockResolvedValue({
        _id: "order123",
      });

      const response = await request(app)
        .delete("/api/orders/order123");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Order deleted successfully"
      );

      expect(
        Order.findByIdAndDelete
      ).toHaveBeenCalledWith("order123");
    });

    test("returns 404 when the order does not exist", async () => {
      Order.findByIdAndDelete.mockResolvedValue(null);

      const response = await request(app)
        .delete("/api/orders/missing-order");

      expect(response.statusCode).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Order not found"
      );
    });

    test("returns 400 when deleting an order fails", async () => {
      Order.findByIdAndDelete.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .delete("/api/orders/order123");

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Delete failed"
      );
      expect(response.body.error).toBe(
        "Database error"
      );
    });
  });
});