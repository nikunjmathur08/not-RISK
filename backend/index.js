const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Enhanced CORS configuration - allow multiple origins
const allowedOrigins = [
  process.env.CORS_ORIGIN, // Production URL
  'http://localhost:5173', // Vite default port
  'http://localhost:3000', // Alternative local port
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean); // Remove any undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, be more permissive
      if (process.env.NODE_ENV === 'development' || !process.env.CORS_ORIGIN) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Security headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || (process.env.NODE_ENV === 'development'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  }
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

const mainRouter = require("./routes/index");

app.get("/testing", (req, res) => {
  return res.status(200).json({
    message: "Working successfully!"
  });
});

app.use("/api/v1", mainRouter);

app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Connected to Supabase');
});