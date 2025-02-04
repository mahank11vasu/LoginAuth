import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { validateUser } from "../middleware/validateUser.js";
import fs from "fs";
import path from "path";


const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export const loginUser = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body; 


        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
        });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user._id);

        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict", maxAge: 3600000 });

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const logoutUser = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
};

export const registerUser = async(req, res) => {
    try{
        const {error} = validateUser(req.body);
        if(error) return res.status(400).json({ message: error.details[0].message});

        const {username, name, email, password, age, phone, role, salary } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email
                    ? "Email is already registered!"
                    : "Username is already taken!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const image = req.file ? `/uploads/${req.file.filename}` :  null;
        
        const newUser = new User({
            username, 
            name,
            email,
            password: hashedPassword,
            age, 
            phone, 
            role, 
            salary,
            image,
        });

        await newUser.save();
        res.status(201).json({message: 'User registered successfully'});
     }catch(error){
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

export const getUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json(users);
    }catch(error){
        res.status(500).json({message: 'Error fetching users', error: error.message});
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, name, email, age, phone, role, salary } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (req.file && user.image) {
            const oldImagePath = path.join("uploads", user.image.split("/uploads/")[1]);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath); 
            }
            user.image = `/uploads/${req.file.filename}`;
        }

        user.username = username || user.username;
        user.name = name || user.name;
        user.email = email || user.email;
        user.age = age || user.age;
        user.phone = phone || user.phone;
        user.role = role || user.role;
        user.salary = salary || user.salary;

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};



export const getUserSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(200).json(null);  
        }

        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(200).json(null);  
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Session Fetch Error:", error);
        res.status(500).json({ message: "Error fetching session", error: error.message });
    }
};






