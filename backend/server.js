
// //server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import userRouter from './routes/userRouter.js';
import { connectDB } from './config/db.js';
import movieRouter from './routes/movieRouter.js';
import bookingRouter from './routes/bookingRouter.js';
import reviewRouter from './routes/reviewRouter.js';
// import theatreRouter from './routes/theatreRouter.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
await connectDB();

// Routes
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/auth', userRouter);
app.use('/api/movies', movieRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews', reviewRouter);
// app.use('/api/theatres', theatreRouter);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


