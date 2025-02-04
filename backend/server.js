import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import session from 'express'

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({origin: 'http://localhost:5173', credentials: true}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));


connectDB();

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});