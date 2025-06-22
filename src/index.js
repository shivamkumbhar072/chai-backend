import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import connectDB from './db/index.js'
import { app } from './app.js';

dotenv.config();
const port = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('vercel working');
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
