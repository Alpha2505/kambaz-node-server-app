import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();

  const findAllEnrollments = async (req, res) => {
    try {
      const enrollments = await dao.findAllEnrollments();
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const enrollUserInCourse = async (req, res) => {
    try {
      const { user, course } = req.body;
      const enrollment = await dao.enrollUserInCourse(user, course);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const unenrollUserFromCourse = async (req, res) => {
    try {
      const { userId, courseId } = req.params;
      const status = await dao.unenrollUserFromCourse(userId, courseId);
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  app.get("/api/enrollments", findAllEnrollments);
  app.post("/api/enrollments", enrollUserInCourse);
  app.delete("/api/enrollments/:userId/:courseId", unenrollUserFromCourse);
}