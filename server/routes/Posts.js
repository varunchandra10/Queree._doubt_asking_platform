import express from "express";
import {
  addPost,
  getPosts,
  getUserPosts,
  likePost,
  dislikePost,
  addComment,
  deleteComment,
  uploadPostMedia,
} from "../controllers/Post.js";
import auth from "../middleware/auth.js";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const router = express.Router();

router.get("/get", getPosts);
router.get("/user-posts/:id", getUserPosts);
router.post("/add", auth, addPost);
router.post('/upload-media', auth, upload.single('file'), uploadPostMedia);
router.patch("/like/:id", auth, likePost);
router.patch("/dislike/:id", auth, dislikePost);

// New routes for adding and deleting comments
router.patch("/add-comment/:id", auth, addComment);
router.delete('/delete-comment/:id', auth, deleteComment);

export default router;
