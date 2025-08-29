import User, { IUser } from "../models/User";
import { Request, Response } from "express";
import { generateOtp } from "../services/otp";
import Otp from "../models/Otp";
import { sendEmail } from "../services/email";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
const client = new OAuth2Client(process.env.CLIENT_ID);
const axios = require("axios");
export async function registerUser(req: Request, res: Response) {
    try {
        const { name, email, dob } = req.body;

        const existingUser = await User.findOne({ email, isActive: true });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = await User.findOneAndUpdate({ email }, { email, name, dob }, { new: true, upsert: true });

        const { otp, expiresAt } = generateOtp(6, 60000);
        console.log("OTP GENERATED ", otp);
        await Otp.findOneAndUpdate({ user: user._id }, { otp, expires: expiresAt }, { new: true, upsert: true });

        await sendEmail({
            to: email,
            subject: "OTP For Signup",
            html: `<p>Hi <strong>${name}</strong>, Please use <strong>${otp}</strong> as your OTP!</p>`
        });
        return res.status(201).json({ message: "OTP Has been successfully sent to " + email });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function verifyOtp(req: Request, res: Response) {
    try {
        const { otp, email } = req.body;

        const otpStore = await Otp.findOne({ otp }).populate<{ user: IUser }>('user');
        if (!otpStore) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        const now = Date.now();
        if (otpStore.expires < now) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        if (otpStore.user.email === email) {
            await User.findByIdAndUpdate(otpStore.user._id, { isActive: true });
            const token = await jwt.sign({ _id: otpStore.user._id, email: otpStore.user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.status(200).json({
                message: "OTP verified successfully", token, user: {
                    id: otpStore.user._id,
                    email: otpStore.user.email,
                    name: otpStore.user.name,
                    dob: otpStore.user.dob
                }
            });
        } else {
            return res.status(400).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { otp, expiresAt } = generateOtp(6, 60000);
        await Otp.findOneAndUpdate({ user: user._id }, { otp, expires: expiresAt }, { new: true, upsert: true });
        await sendEmail({
            to: email,
            subject: "Your Login OTP ",
            html: `<p>Your OTP code is <strong>${otp}</strong></p>`
        });
        return res.status(200).json({
            message: "OTP Sent Successfully"
        });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function googleLogin(req: Request, res: Response) {
    const { access_token } = req.body;
    if (!access_token) {
        return res.status(400).json({ message: "Access token is required" });
    }
    try {
        const googleRes = await axios.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: { Authorization: `Bearer ${access_token}` },
            }
        );
        const { email, name, picture } = googleRes.data;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const existingUser = await User.findOne({ email: googleRes.data.email });
        if (existingUser) {
            const token = await jwt.sign({ _id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.status(200).json({ message: "Google login successful", user: existingUser, token });
        } else {
            const newUser = await User.create({
                email,
                name,
                isActive: true
            });
            const token = await jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.status(201).json({ message: "Google Login Successful", user: newUser, token });
        }

    } catch (error) {
        console.error("Error during Google login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
