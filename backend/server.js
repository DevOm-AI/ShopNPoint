require('dotenv').config(); // Move it to the very top!
const express = require('express');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes'); 

const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');

const orderRoutes = require('./routes/orderRoutes');



dotenv.config();

const cors = require('cors');
const { testConnection } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');

// Test the database connection
// This will now work because dotenv.config() has already run.
testConnection();

const app = express();


// Configure CORS to explicitly allow requests from your frontend's origin
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));


// API Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use('/api/admin', adminRoutes);

// Custom Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});