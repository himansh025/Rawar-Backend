

import express from 'express';
import cors from 'cors';
const express = require('express'); 
import cookieParser from "cookie-parser";
import cors from "cors";
import path from 'path';
const app = express();

// CORS configuration based on environment


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

// Static files configuration
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use(cookieParser());

// Importing Routes
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import testRoutes from './routes/tests.js';
import userRoutes from './routes/users.js';



app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/tests', testRoutes);

export default app;