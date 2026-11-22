import mongoose from 'mongoose';
import Questions from '../models/Questions.js';

export const postAnswer = async(req, res) => {
    const{ id: _id } = req.params;
    const { answerBody, userAnswered } = req.body;
    const userId = req.userId || req.body.userId;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("question unavailable...");
    }

    try{
        const updatedQuestion = await Questions.findByIdAndUpdate(
            _id,
            {
                $push: { answer: { answerBody, userAnswered, userId } },
                $inc: { noOfAnswers: 1 }
            },
            { new: true }
        );
        res.status(200).json(updatedQuestion);
    }catch(error){
        res.status(400).json(error);
    }
};

export const deleteAnswer = async (req, res)=>{
    const { id:_id} = req.params;
    const { answerId } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send("question unavailable...");
    }

    if(!mongoose.Types.ObjectId.isValid(answerId)){
        return res.status(404).send("Answer unavailable...");
    }

    try{
        await Questions.updateOne(
            {_id},
            {
                $pull: { 'answer':{_id:answerId}},
                $inc: { noOfAnswers: -1 }
            }
        );
        res.status(200).json({message:"successfully deleted..."});
    }catch(error){
        res.status(405).json(error);
    }
}
