import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app) {
  const dao = QuizzesDao();

  const findQuizzesForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const quizzes = await dao.findQuizzesForCourse(courseId);
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const createQuizForCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const quiz = req.body;
      const newQuiz = await dao.createQuiz(courseId, quiz);
      res.send(newQuiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const deleteQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const status = await dao.deleteQuiz(quizId);
      res.send(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const updateQuiz = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quizUpdates = req.body;
      const status = await dao.updateQuiz(quizId, quizUpdates);
      res.send(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const findQuizById = async (req, res) => {
    try {
      const { quizId } = req.params;
      const quiz = await dao.findQuizById(quizId);
      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }
      res.json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  app.get("/api/courses/:courseId/quizzes", findQuizzesForCourse);
  app.post("/api/courses/:courseId/quizzes", createQuizForCourse);
  app.delete("/api/quizzes/:quizId", deleteQuiz);
  app.put("/api/quizzes/:quizId", updateQuiz);
  app.get("/api/quizzes/:quizId", findQuizById);
}

