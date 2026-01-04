import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import preschoolsRouter from './routes/preschools.js';
import comparisonRouter from './routes/comparison.js';
import googleMapsRouter from './routes/googleMaps.js';
import reviewsRouter from './routes/reviews.js';
import detailsRouter from './routes/details.js';
import contactRouter from './routes/contact.js';
import adminRouter from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS must be before helmet - allow both local dev ports
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/preschools', preschoolsRouter);
app.use('/api/comparison', comparisonRouter);
app.use('/api/google-maps', googleMapsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/details', detailsRouter);
app.use('/api', contactRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Database connection and server start
sequelize
  .authenticate()
  .then(() => {
    console.log('✓ Database connected successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('✓ Database synchronized');
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  });

export default app;
