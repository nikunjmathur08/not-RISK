const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set Cross-Origin-Opener-Policy header
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const mainRouter = require("./routes/index");

app.use("/api/v1", mainRouter);
app.listen(3000);