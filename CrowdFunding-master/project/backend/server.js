import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import documentRoutes from "./routes/document.routes.js";
import investmentRoutes from "./routes/investment.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import messageRoutes from "./routes/message.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import companyRoutes from "./routes/company.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import paymentRoutes from "./routes/payment.routes.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { protect } from "./middleware/auth.middleware.js";
import cron from "node-cron";
import { lockExpiredProjects } from "./controllers/project.controller.js";
import User from "./models/User.js";

// Initialize dotenv configuration first
dotenv.config();

// ─── Admin Auto-Seed ─────────────────────────────────────────────────────────
// Ensures the admin account always exists with the correct role on every boot.
// Idempotent: safe to run repeatedly — uses upsert.
const ensureAdminUser = async () => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.warn("⚠️  ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed.");
      return;
    }

    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // Ensure role is admin even if someone manually changed it
      if (existing.role !== "admin") {
        await User.findByIdAndUpdate(existing._id, { role: "admin", isVerified: true });
        console.log("✅ Admin role corrected for:", ADMIN_EMAIL);
      } else {
        console.log("✅ Admin user exists:", ADMIN_EMAIL);
      }
    } else {
      // Create fresh admin — pre-hash password (pre-save hook fires on create())
      const admin = await User.create({
        name: ADMIN_NAME || "Administrator",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // pre-save hook will hash this
        role: "admin",
        isVerified: true,
      });
      console.log("✅ Admin user created:", ADMIN_EMAIL);
    }
  } catch (err) {
    console.error("❌ Failed to ensure admin user:", err.message);
  }
};
// ─────────────────────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    const app = express();
    const httpServer = createServer(app);

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [
      "http://localhost:5173",
    ];

    // Configure Socket.IO — use env-driven origins
    const io = new Server(httpServer, {
      cors: {
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            // Also allow LAN IPs dynamically (any 192.168.x.x:5173)
            const isLanOrigin = /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
                                /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
                                /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?$/.test(origin);
            if (isLanOrigin) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
      },
    });

    // Middleware
    app.use(
      helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: false,
      }),
    );

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            // Allow private LAN IPs dynamically for cross-device dev access
            const isLanOrigin =
              /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/.test(origin) ||
              /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/.test(origin) ||
              /^http:\/\/172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+(:\d+)?$/.test(origin);
            if (isLanOrigin) {
              callback(null, true);
            } else {
              callback(new Error("Not allowed by CORS"));
            }
          }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"],
        maxAge: 86400,
      }),
    );

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    // Handle preflight requests
    app.options("*", cors());

    app.use(apiLimiter);

    // Serve uploaded files
    app.use("/uploads", express.static("uploads"));

    app.get("/uploads/:type/:filename", protect, (req, res) => {
      const { type, filename } = req.params;
      res.sendFile(`uploads/${type}/${filename}`);
    });

    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });

      socket.on("projectUpdate", (data) => {
        io.emit("projectUpdated", data);
      });

      socket.on("newProject", (data) => {
        io.emit("projectCreated", data);
      });
    });

    // Make io accessible to routes
    app.set("io", io);

    // Schedule project locking (every hour)
    cron.schedule("0 * * * *", () => {
      console.log("Running cron job for project locking...");
      lockExpiredProjects();
    });

    // Health check route
    app.get("/health", (req, res) => {
      res.status(200).json({
        status: "ok",
        message: "Server is running",
        timestamp: new Date().toISOString(),
      });
    });

    // Root route
    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    // API Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/projects", projectRoutes);
    app.use("/api/documents", documentRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/investments", investmentRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/reviews", reviewRoutes);
    app.use("/api/messages", messageRoutes);
    app.use("/api/complaints", complaintRoutes);
    app.use("/api/companies", companyRoutes);

    // Error Handler
    app.use(errorHandler);

    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected Successfully");

    // Ensure admin user exists (auto-seed from .env — idempotent)
    await ensureAdminUser();

    // Start the server
    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT} (all interfaces)`);
      console.log(`🔗 Local:    http://localhost:${PORT}`);
      console.log(`🌐 Network:  http://0.0.0.0:${PORT}`);
      console.log(`⚡ WebSocket server ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer().catch((error) => {
  console.error("Server startup error:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
