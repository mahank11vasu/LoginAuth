import mongoose, { Mongoose } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
        },
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String, 
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        age:{
            type: Number,
            required: true,
        },
        phone:{
            type: String,
            required: true,
        },
        role:{
            type: String,
            enum:['Player', 'Organizer'],
            required: true,
        },
        salary:{
            type: Number,
            required: true,
        },
        image:{
            type: String,
            required: false,
        },
    },
    {timestamps: true, versionKey: false}
);

userSchema.method.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;