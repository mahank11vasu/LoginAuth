import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from 'express-session'
import MongoStore from "connect-mongo";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "defaultsecret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), 
        cookie: {
            httpOnly: true,
            secure: false, 
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
    );
    
    app.use(cors({origin: 'http://localhost:5173', credentials: true}));
    app.use(morgan('dev'));
    connectDB();
    
    app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
});