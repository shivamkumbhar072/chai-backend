import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import mongoose from 'mongoose';
import connectDB from './db/index.js';
import { app } from './app.js';

const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Test route
app.get('/', (req, res) => {
  res.send('✅ Vercel working');
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
