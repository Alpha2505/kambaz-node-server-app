import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizzesDao() {
  async function findQuizzesForCourse(courseId) {
    console.log("=== Finding quizzes for course:", courseId);
    const quizzes = await model.find({ course: courseId });
    console.log("=== Found quizzes:", quizzes);
    return quizzes;
  }

  async function createQuiz(courseId, quiz) {
    // Calculate points from questions if not set
    const calculatedPoints = quiz.questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;
    const finalPoints = quiz.points || calculatedPoints;
    
    const newQuiz = { 
      ...quiz, 
      _id: uuidv4(),
      course: courseId,
      published: quiz.published || false,
      questionCount: quiz.questions?.length || 0,
      points: finalPoints,
      quizType: quiz.quizType || "Graded Quiz",
      assignmentGroup: quiz.assignmentGroup || "Quizzes",
      shuffleAnswers: quiz.shuffleAnswers !== false,
      timeLimit: quiz.timeLimit || 20,
      multipleAttempts: quiz.multipleAttempts || false,
      attemptsAllowed: quiz.attemptsAllowed || 1,
      showCorrectAnswers: quiz.showCorrectAnswers || "Immediately",
      accessCode: quiz.accessCode || "",
      oneQuestionAtATime: quiz.oneQuestionAtATime !== false,
      webcamRequired: quiz.webcamRequired || false,
      lockQuestionsAfterAnswering: quiz.lockQuestionsAfterAnswering || false,
    };
    const createdQuiz = await model.create(newQuiz);
    return createdQuiz;
  }

  async function deleteQuiz(quizId) {
    const status = await model.deleteOne({ _id: quizId });
    return status;
  }

  async function updateQuiz(quizId, quizUpdates) {
    // Update questionCount if questions array is modified
    if (quizUpdates.questions !== undefined) {
      quizUpdates.questionCount = quizUpdates.questions.length;
      // Recalculate points from questions if points not explicitly set
      if (quizUpdates.points === undefined || quizUpdates.points === null) {
        const calculatedPoints = quizUpdates.questions.reduce((sum, q) => sum + (q.points || 0), 0);
        quizUpdates.points = calculatedPoints;
      }
    }
    const updatedQuiz = await model.findOneAndUpdate(
      { _id: quizId },
      { $set: quizUpdates },
      { new: true }
    );
    return updatedQuiz;
  }

  async function findQuizById(quizId) {
    const quiz = await model.findOne({ _id: quizId });
    return quiz;
  }

  return {
    findQuizzesForCourse,
    createQuiz,
    deleteQuiz,
    updateQuiz,
    findQuizById,
  };
}

