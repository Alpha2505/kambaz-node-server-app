import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quiz: { type: String, required: true },
    user: { type: String, required: true },
    attemptNumber: { type: Number, required: true },
    answers: [{ type: Object }], // Array of answer objects
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    submittedAt: Date,
    completed: { type: Boolean, default: false },
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;

