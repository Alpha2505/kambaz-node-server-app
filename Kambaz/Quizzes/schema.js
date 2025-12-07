import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: { type: String, required: true },
    description: String,
    points: Number,
    availableFrom: Date,
    availableUntil: Date,
    dueDate: Date,
    published: { type: Boolean, default: false },
    questions: [{ type: Object }],
    questionCount: { type: Number, default: 0 },
    quizType: { type: String, default: "Graded Quiz" }, // Graded Quiz, Practice Quiz, Graded Survey, Ungraded Survey
    assignmentGroup: { type: String, default: "Quizzes" }, // Quizzes, Exams, Assignments, Project
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    attemptsAllowed: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Immediately" }, // Immediately, After Due Date, etc.
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
  },
  { collection: "quizzes" }
);

export default quizSchema;

