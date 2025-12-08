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
    
    // Quiz Settings
    quizType: { type: String, default: "Graded Quiz" }, // Graded Quiz, Practice Quiz, Graded Survey, Ungraded Survey
    assignmentGroup: { type: String, default: "Quizzes" }, // Quizzes, Exams, Assignments, Project
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 }, // in minutes
    multipleAttempts: { type: Boolean, default: false },
    attemptsAllowed: { type: Number, default: 1 },
    
    // Display Settings
    viewResponses: { type: String, default: "Always" }, // MISSING - Always, Never, etc.
    showCorrectAnswers: { type: String, default: "Immediately" }, // Immediately, After Due Date, etc.
    
    // Access and Security
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    
    // LockDown Browser Settings
    requireRespondusLockDown: { type: Boolean, default: false }, // MISSING
    requiredToViewQuizResults: { type: Boolean, default: false }, // MISSING
  },
  { 
    collection: "quizzes",
    timestamps: true // Optional: adds createdAt and updatedAt fields
  }
);

export default quizSchema;