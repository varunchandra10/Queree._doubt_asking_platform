import express from 'express';

import { signup, login, sendOtp, verifyOtp } from '../controllers/auth.js';
import { getAllUsers, updateProfile, follow, unfollow, uploadProfileImage } from '../controllers/users.js';
import auth from '../middleware/auth.js';
import multer from 'multer';

// Limit uploads to 5 MB and use memory storage (we stream to Cloudinary)
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.post('/send-otp', sendOtp)
router.post('/verify-otp', verifyOtp)

router.get('/getAllUsers', getAllUsers)
router.patch('/update/:id', auth, updateProfile)
router.post(
	'/upload-profile',
	auth,
	upload.single('file'),
	(req, res, next) => {
		console.log('[debug] /user/upload-profile called; userId=', req.userId, 'file=', req.file ? req.file.originalname : 'none');
		next();
	},
	uploadProfileImage
);

// public test route to verify router is mounted
router.get('/upload-test', (req, res) => {
  res.status(200).json({ ok: true, route: '/user/upload-test' });
});

router.patch('/friend', auth, follow);
router.patch('/unfriend', auth, unfollow);

export default router;