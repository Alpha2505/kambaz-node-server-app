import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function QuizAttemptsDao() {
  async function createAttempt(attempt) {
    const newAttempt = { 
      ...attempt, 
      _id: uuidv4(),
      startedAt: new Date(),
    };
    const createdAttempt = await model.create(newAttempt);
    return createdAttempt;
  }

  async function updateAttempt(attemptId, attemptUpdates) {
    const updatedAttempt = await model.findOneAndUpdate(
      { _id: attemptId },
      { $set: attemptUpdates },
      { new: true }
    );
    return updatedAttempt;
  }

  async function findAttemptById(attemptId) {
    const attempt = await model.findOne({ _id: attemptId });
    return attempt;
  }

  async function findAttemptsByQuizAndUser(quizId, userId) {
    const attempts = await model.find({ quiz: quizId, user: userId })
      .sort({ attemptNumber: -1 });
    return attempts;
  }

  async function findLatestAttempt(quizId, userId) {
    const attempt = await model.findOne({ quiz: quizId, user: userId })
      .sort({ attemptNumber: -1 });
    return attempt;
  }

  async function getAttemptCount(quizId, userId) {
    const count = await model.countDocuments({ quiz: quizId, user: userId });
    return count;
  }

  async function deleteAttempt(attemptId) {
    const status = await model.deleteOne({ _id: attemptId });
    return status;
  }

  return {
    createAttempt,
    updateAttempt,
    findAttemptById,
    findAttemptsByQuizAndUser,
    findLatestAttempt,
    getAttemptCount,
    deleteAttempt,
  };
}

