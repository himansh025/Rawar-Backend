
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
// import path from 'path';
const app = express();
console.log("hello");

const allowedOrigins = [
  'http://localhost:5173', // Local development frontend
   '', // Production frontend
];



app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware for parsing incoming requests
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import admin from './routes/adminRoutes.js';
import questionRoutes from './routes/quizRoute.js';
import testRoutes from './routes/testRoute.js';
import userRoutes from './routes/userRoutes.js';

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/admin', admin);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/tests', testRoutes);
export default app;