const express = require("express");
const request = require("supertest");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const authRoutes = require("../routes/authRoutes");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Admin Authentication API", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      ADMIN_EMAIL: "admin@swacafe.com",
      ADMIN_PASSWORD_HASH: "mock-hashed-password",
      JWT_SECRET: "mock-jwt-secret",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test("logs in admin successfully with valid credentials", async () => {
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-admin-token");

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@swacafe.com",
        password: "correct-password",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.token).toBe("mock-admin-token");

    expect(bcrypt.compare).toHaveBeenCalledWith(
      "correct-password",
      "mock-hashed-password"
    );

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        admin: true,
        email: "admin@swacafe.com",
      },
      "mock-jwt-secret",
      {
        expiresIn: "8h",
      }
    );
  });

  test("accepts admin email regardless of letter case", async () => {
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-admin-token");

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "ADMIN@SWACAFE.COM",
        password: "correct-password",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test("returns 400 when email or password is missing", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@swacafe.com",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Email and password are required"
    );

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("returns 401 for an incorrect admin email", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@example.com",
        password: "some-password",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Invalid email or password"
    );

    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  test("returns 401 for an incorrect password", async () => {
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@swacafe.com",
        password: "wrong-password",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Invalid email or password"
    );

    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test("returns 500 when admin environment variables are missing", async () => {
    delete process.env.ADMIN_EMAIL;
    delete process.env.ADMIN_PASSWORD_HASH;
    delete process.env.JWT_SECRET;

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@swacafe.com",
        password: "password",
      });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "Admin login is not configured"
    );
  });
});