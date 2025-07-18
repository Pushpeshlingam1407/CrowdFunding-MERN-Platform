import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import adminRoutes from './routes/admin.routes.js';
import userRoutes from './routes/user.routes.js';
import documentRoutes from './routes/document.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import paymentRoutes from './routes/payment.routes.js';
// Initialize dotenv configuration first
dotenv.config();

const startServer = async () => {
  try {
    const app = express();
    const httpServer = createServer(app);

    // Configure Socket.IO
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"]
      }
    });

    // Middleware
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Handle preflight requests
    app.options('*', cors());

    // Static files
    app.use('/uploads', express.static('uploads'));

    // Socket.IO connection handling
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });

      // Handle project updates
      socket.on('projectUpdate', (data) => {
        io.emit('projectUpdated', data);
      });

      // Handle new projects
      socket.on('newProject', (data) => {
        io.emit('projectCreated', data);
      });
    });

    // Make io accessible to routes
    app.set('io', io);

    // Health check route
    app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
      });
    });

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/admin', adminRoutes);

    // Error Handler
    app.use(errorHandler);

    

    app.use("/api/payment", paymentRoutes);
    

    // Connect to MongoDB first
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected Successfully');

    // Try to start the server
    const PORT = process.env.PORT || 5000;
    
    // Check if port is in use
    const server = httpServer.listen(PORT);
    
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Trying port ${PORT + 1}`);
        server.listen(PORT + 1);
      } else {
        console.error('Server error:', error);
        process.exit(1);
      }
    });

    server.on('listening', () => {
      const address = server.address();
      console.log(`Server is running on port ${address.port}`);
      console.log(`WebSocket server is ready`);
      console.log(`Frontend URL: http://localhost:5173`);
      console.log(`API URL: http://localhost:${address.port}`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  console.error('Server startup error:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Don't crash the server, just log the error
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't crash the server, just log the error
});
