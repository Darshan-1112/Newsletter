const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const subRoutes = require('./routes/subRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser()); // Required to read cookies

// CORS Configuration (Critical for Cookies)
app.use(cors({
    origin: 'http://localhost:3001', // Your Next.js URL
    credentials: true // Allows cookies to be sent back and forth
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscribers', subRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));