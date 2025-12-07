import QuizAttemptsDao from "./dao.js";
import QuizzesDao from "../Quizzes/dao.js";

export default function QuizAttemptsRoutes(app) {
  const dao = QuizAttemptsDao();
  const quizzesDao = QuizzesDao();

  const startAttempt = async (req, res) => {
    try {
      const { quizId } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Get quiz to check attempt limits
      const quiz = await quizzesDao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      // Check if quiz is published
      if (!quiz.published) {
        res.status(403).json({ message: "Quiz is not published" });
        return;
      }

      // Get current attempt count
      const attemptCount = await dao.getAttemptCount(quizId, currentUser._id);
      
      // Check attempt limits
      if (quiz.multipleAttempts) {
        if (attemptCount >= (quiz.attemptsAllowed || 1)) {
          res.status(403).json({ message: "Maximum attempts reached" });
          return;
        }
      } else {
        if (attemptCount > 0) {
          res.status(403).json({ message: "Multiple attempts not allowed" });
          return;
        }
      }

      // Create new attempt
      const newAttempt = await dao.createAttempt({
        quiz: quizId,
        user: currentUser._id,
        attemptNumber: attemptCount + 1,
        answers: [],
        totalPoints: quiz.points || 0,
      });

      res.json(newAttempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const submitAttempt = async (req, res) => {
    try {
      const { attemptId } = req.params;
      const { answers } = req.body;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const attempt = await dao.findAttemptById(attemptId);
      if (!attempt) {
        res.status(404).json({ message: "Attempt not found" });
        return;
      }

      if (attempt.user !== currentUser._id) {
        res.status(403).json({ message: "Unauthorized" });
        return;
      }

      if (attempt.completed) {
        res.status(400).json({ message: "Attempt already submitted" });
        return;
      }

      // Get quiz to calculate score
      const quiz = await quizzesDao.findQuizById(attempt.quiz);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      // Calculate score
      let score = 0;
      quiz.questions?.forEach((question, index) => {
        const userAnswer = answers[index];
        let isCorrect = false;

        if (question.type === "multipleChoice") {
          isCorrect = userAnswer === question.correctAnswer;
        } else if (question.type === "trueFalse") {
          isCorrect = userAnswer === question.correctAnswer;
        } else if (question.type === "fillInBlank") {
          const userAnswerStr = String(userAnswer || "").trim().toLowerCase();
          isCorrect = question.possibleAnswers?.some((ans) => 
            ans.trim().toLowerCase() === userAnswerStr
          ) || false;
        }

        if (isCorrect) {
          score += question.points || 0;
        }
      });

      // Update attempt
      const updatedAttempt = await dao.updateAttempt(attemptId, {
        answers,
        score,
        submittedAt: new Date(),
        completed: true,
      });

      res.json(updatedAttempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getLatestAttempt = async (req, res) => {
    try {
      const { quizId } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const attempt = await dao.findLatestAttempt(quizId, currentUser._id);
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getAllAttempts = async (req, res) => {
    try {
      const { quizId } = req.params;
      const currentUser = req.session["currentUser"];
      
      if (!currentUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const attempts = await dao.findAttemptsByQuizAndUser(quizId, currentUser._id);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  app.post("/api/quizzes/:quizId/attempts", startAttempt);
  app.post("/api/attempts/:attemptId/submit", submitAttempt);
  app.get("/api/quizzes/:quizId/attempts/latest", getLatestAttempt);
  app.get("/api/quizzes/:quizId/attempts", getAllAttempts);
}

