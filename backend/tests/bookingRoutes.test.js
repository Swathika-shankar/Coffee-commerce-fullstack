const express = require("express");
const request = require("supertest");

const Booking = require("../models/Booking");
const bookingRoutes = require("../routes/bookingRoutes");

jest.mock("../models/Booking");

const app = express();

app.use(express.json());
app.use("/api/bookings", bookingRoutes);

describe("Booking API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/bookings", () => {
    test("creates a new table booking successfully", async () => {
      const bookingData = {
        name: "Test Customer",
        phone: "07123456789",
        date: "2026-09-10",
        time: "18:30",
        guests: 2,
      };

      const savedBooking = {
        _id: "booking123",
        ...bookingData,
      };

      Booking.create.mockResolvedValue(savedBooking);

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData);

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Table booked successfully"
      );
      expect(response.body.booking).toEqual(savedBooking);

      expect(Booking.create).toHaveBeenCalledWith(
        bookingData
      );
    });

    test("returns 400 when booking creation fails", async () => {
      Booking.create.mockRejectedValue(
        new Error("Booking validation failed")
      );

      const response = await request(app)
        .post("/api/bookings")
        .send({
          name: "Test Customer",
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Booking failed");
      expect(response.body.error).toBe(
        "Booking validation failed"
      );
    });
  });

  describe("GET /api/bookings", () => {
    test("returns all bookings", async () => {
      const mockBookings = [
        {
          _id: "booking1",
          name: "Customer One",
          phone: "07111111111",
          date: "2026-09-10",
          time: "18:00",
          guests: 2,
        },
        {
          _id: "booking2",
          name: "Customer Two",
          phone: "07222222222",
          date: "2026-09-11",
          time: "19:00",
          guests: 4,
        },
      ];

      const sortMock = jest
        .fn()
        .mockResolvedValue(mockBookings);

      Booking.find.mockReturnValue({
        sort: sortMock,
      });

      const response = await request(app)
        .get("/api/bookings");

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockBookings);

      expect(Booking.find).toHaveBeenCalled();

      expect(sortMock).toHaveBeenCalledWith({
        createdAt: -1,
      });
    });

    test("returns 500 when bookings cannot be loaded", async () => {
      const sortMock = jest
        .fn()
        .mockRejectedValue(new Error("Database error"));

      Booking.find.mockReturnValue({
        sort: sortMock,
      });

      const response = await request(app)
        .get("/api/bookings");

      expect(response.statusCode).toBe(500);
      expect(response.body.message).toBe(
        "Could not fetch bookings"
      );
    });
  });

  describe("DELETE /api/bookings/:id", () => {
    test("deletes a booking successfully", async () => {
      Booking.findByIdAndDelete.mockResolvedValue({
        _id: "booking123",
      });

      const response = await request(app)
        .delete("/api/bookings/booking123");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Booking deleted"
      );

      expect(
        Booking.findByIdAndDelete
      ).toHaveBeenCalledWith("booking123");
    });

    test("returns 500 when deleting a booking fails", async () => {
      Booking.findByIdAndDelete.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .delete("/api/bookings/booking123");

      expect(response.statusCode).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        "Delete failed"
      );
    });
  });
});