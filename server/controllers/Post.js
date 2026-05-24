import Post from "../models/Post.js";
import mongoose from "mongoose";
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getPosts = async (req,res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const getUserPosts = async (req,res) => {
    const id = req.params.id;
    try {
        const posts = await Post.find({ userId: id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
}

export const addPost = async (req,res) => {
    const data = req.body;
    console.log(data);
    const newPost = new Post(data);
    try {
        const savedPost = await newPost.save();
        res.status(201).json({ success: true, Post: savedPost });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

  export const uploadPostMedia = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_CLOUD_NAME) {
        return res.status(500).json({ message: 'Cloudinary not configured on the server.' });
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Invalid file type. Allowed: jpg, png, webp, gif, mp4, webm, mov' });
      }

      const resourceType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: 'posts',
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      res.status(200).json({ success: true, result: uploadResult });
    } catch (err) {
      console.error('uploadPostMedia error', err);
      res.status(500).json({ message: err.message || 'Upload failed' });
    }
  }

export const likePost = async (req, res) => {
    console.log(req.body.userId)
    try{
        const post = await Post.findById(req.params.id);
        if(!post) res.status(500).json("Post not found!!!");

        const newPost = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likes: req.body.userId }
            },
            { new: true }
        );
        res.status(200).json(newPost); 
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

export const dislikePost = async (req,res) => {
    try{
        // console.log(req.userId)
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likes: req.body.userId},
            }, 
            { new: true }
        )
        res.status(200).json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}


export const addComment = async (req, res) => {
    const { postId,userId, content,name } = req.body;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found!" });
      }
  
      const newComment = {
        commentId: new mongoose.Types.ObjectId(),
        userId,
        content,
        name,
        createdAt: new Date(),
      };
  
      post.comments.push(newComment);
      await post.save();
  
      res.status(201).json(newComment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  export const deleteComment = async (req, res) => {
    const { postId, commentId } = req.body;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ error: "Post not found!" });
      }
  
      const commentIndex = post.comments.findIndex(
        (comment) => comment.commentId.toString() === commentId
      );
  
      if (commentIndex === -1) {
        return res.status(404).json({ error: "Comment not found!" });
      }
  
      post.comments.splice(commentIndex, 1);
      await post.save();
  
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  