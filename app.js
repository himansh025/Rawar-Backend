
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
const app = express();
app.use("/api/health",async(req,res)=>{
  res.send("working fine"));
const allowedOrigins =['https://rawar-frontend.vercel.app'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without origin (e.g., from Postman)
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
import revision from './routes/revisionRoutes.js';

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/admin', admin);
app.use('/api/v1/questions', questionRoutes);
app.use('/api/v1/tests', testRoutes);
app.use('/api/v1/revision', revision);

export default app;
