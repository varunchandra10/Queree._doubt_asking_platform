import express from 'express'
import Questions from '../models/Questions.js'
import { AskQuestion, getAllQuestions, deleteQuestion, voteQuestion } from '../controllers/Questions.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/Ask',auth, AskQuestion);
router.get('/get', getAllQuestions);
router.get('/asked/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userQuestions = await Questions.find({ userId: id }).sort({ askedOn: -1 });
        res.status(200).json(userQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete('/delete/:id',auth, deleteQuestion);
router.patch('/vote/:id',auth, voteQuestion);

export default router;