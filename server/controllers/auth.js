import '../loadEnv.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'

import User from '../models/auth.js';

const otpStore = new Map();

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const createMailTransporter = () => {
    const service = process.env.SMTP_SERVICE;
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass) {
        throw new Error('SMTP_USER and SMTP_PASS must be configured.');
    }

    if (!service && !host) {
        throw new Error('SMTP_SERVICE or SMTP_HOST must be configured.');
    }

    const transportConfig = {
        auth: {
            user,
            pass,
        },
    };

    if (service) {
        transportConfig.service = service;
    } else {
        transportConfig.host = host;
        transportConfig.port = Number(process.env.SMTP_PORT || 587);
        transportConfig.secure = String(process.env.SMTP_PORT || '') === '465';
    }

    return nodemailer.createTransport(transportConfig);
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({message:"User already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({ name, email, password:hashedPassword });

        const token = jwt.sign({ email: newUser.email, id:newUser._id},process.env.JWT_SECRET, { expiresIn:'1h'});

        res.status(200).json({ result: newUser, token });

    }catch(error){
        res.status(500).json("Something went wrong....");
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const existingUser = await User.findOne({ email });

        if(!existingUser){
            return res.status(404).json({message:"User does not exist."});
        }

        const isPasswordCrt = await bcrypt.compare(password, existingUser.password);

        if(!isPasswordCrt){
            return res.status(400).json({message: "Invalid credentials "});
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id},process.env.JWT_SECRET, { expiresIn: '1h'});

        res.status(200).json({result: existingUser, token});

    }catch(error) {
        res.status(500).json("Something went wrong...")
    }
};

export const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const mailTransporter = createMailTransporter();
        const otp = createOtp();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        otpStore.set(email.toLowerCase(), { otp, expiresAt });

        await mailTransporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: 'Your verification code',
            text: `Your verification code is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your verification code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`,
        });

        res.status(200).json({ message: 'OTP sent successfully.' });
    } catch (error) {
        console.error('OTP mail error:', error);
        res.status(500).json({ message: 'Failed to send OTP.' });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const storedOtp = otpStore.get(normalizedEmail);

    if (!storedOtp) {
        return res.status(400).json({ message: 'OTP not found or expired.' });
    }

    if (storedOtp.expiresAt < Date.now()) {
        otpStore.delete(normalizedEmail);
        return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
    }

    if (storedOtp.otp !== String(otp)) {
        return res.status(400).json({ message: 'Invalid OTP.' });
    }

    otpStore.delete(normalizedEmail);
    return res.status(200).json({ message: 'OTP verified successfully.', email: normalizedEmail });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (!existingUser) {
            return res.status(404).json({ message: 'No account registered with this email address.' });
        }

        const mailTransporter = createMailTransporter();
        const otp = createOtp();
        const expiresAt = Date.now() + 10 * 60 * 1000;

        otpStore.set(`reset_${normalizedEmail}`, { otp, expiresAt });

        await mailTransporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: normalizedEmail,
            subject: 'Queree. Password Reset Code',
            text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes.</p>`,
        });

        res.status(200).json({ message: 'Password reset OTP sent to email.' });
    } catch (error) {
        console.error('forgotPassword error:', error);
        res.status(500).json({ message: 'Failed to send password reset code. Please check SMTP settings.' });
    }
};

export const verifyForgotPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const storedOtp = otpStore.get(`reset_${normalizedEmail}`);

    if (!storedOtp) {
        return res.status(400).json({ message: 'Reset code not found or expired. Please request a new one.' });
    }

    if (storedOtp.expiresAt < Date.now()) {
        otpStore.delete(`reset_${normalizedEmail}`);
        return res.status(400).json({ message: 'Reset code expired. Please request a new one.' });
    }

    if (storedOtp.otp !== String(otp)) {
        return res.status(400).json({ message: 'Invalid OTP code.' });
    }

    return res.status(200).json({ message: 'OTP verified successfully.', email: normalizedEmail });
};

export const resetPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
        return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    const normalizedEmail = email.toLowerCase();
    const storedOtp = otpStore.get(`reset_${normalizedEmail}`);

    if (!storedOtp) {
        return res.status(400).json({ message: 'Reset code not found or expired. Please request a new one.' });
    }

    if (storedOtp.expiresAt < Date.now()) {
        otpStore.delete(`reset_${normalizedEmail}`);
        return res.status(400).json({ message: 'Reset code expired. Please request a new one.' });
    }

    if (storedOtp.otp !== String(otp)) {
        return res.status(400).json({ message: 'Invalid OTP code.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const updatedUser = await User.findOneAndUpdate(
            { email: normalizedEmail },
            { $set: { password: hashedPassword } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User account not found.' });
        }

        otpStore.delete(`reset_${normalizedEmail}`);
        return res.status(200).json({ message: 'Password reset successfully. You can now log in.' });
    } catch (error) {
        console.error('resetPassword error:', error);
        return res.status(500).json({ message: 'Failed to update password.' });
    }
};