import mongoose from 'mongoose'
import User from '../models/auth.js'
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();
        const allUserDetails = []
        allUsers.forEach(user => {
            allUserDetails.push({ _id: user._id, name: user.name, about: user.about, profileImage: user.profileImage, tags: user.tags, joinedOn: user.joinedOn, friends: user.friends, subscription: user.subscription })
        })
        res.status(200).json(allUserDetails);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags, profileImage } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable...');
    }

    try {
        const updateFields = { 'name': name, 'about': about, 'tags': tags };
        if (profileImage) updateFields.profileImage = profileImage;

        const updatedProfile = await User.findByIdAndUpdate( _id, { $set: updateFields }, { new: true } )
        // { new: true } as mongo returns old data and not the new updated one 
        res.status(200).json(updatedProfile)
    } catch (error) {
        res.status(405).json({ message: error.message })
    }
}

export const follow = async (req, res) => {
    const user = req.body.userId;
    const friend = req.body.id;
    try{
        const updatedUser = await User.findByIdAndUpdate(
            user,
            {
                $addToSet: { friends: friend },
            },
            { new: true }
        );
        await User.findByIdAndUpdate(
            friend,
            {
                $addToSet: { friends: user },
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(405).json(err);
    }
}

export const unfollow = async (req, res) => {
        const user = req.body.userId;
        const friend = req.body.id;
    try{
        const updatedUser = await User.findByIdAndUpdate(
            user,
            {
                $pull: { friends: friend },
            },
            { new: true }
        );
        await User.findByIdAndUpdate(
            friend,
            {
                $pull: { friends: user },
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(405).json(err);
    }
}

export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        // Ensure Cloudinary credentials are configured
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
            console.error('Cloudinary credentials missing');
            return res.status(500).json({ message: 'Cloudinary not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server .env' });
        }
        // Validate file type and size (max 5MB)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: 'Invalid file type. Allowed: jpg, png, webp, gif' });
        }
        const maxSize = 5 * 1024 * 1024;
        if (req.file.size > maxSize) {
            return res.status(400).json({ message: 'File too large. Max size is 5MB.' });
        }
        const userId = req.userId;

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream({ folder: 'profiles' }, (error, result) => {
                if (error) return reject(error);
                resolve(result);
            });
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

        const updatedUser = await User.findByIdAndUpdate(userId, { $set: { profileImage: uploadResult.secure_url } }, { new: true });
        res.status(200).json({ success: true, result: updatedUser });
    } catch (err) {
        console.error('uploadProfileImage error', err);
        res.status(500).json({ message: err.message || 'Upload failed' });
    }
}