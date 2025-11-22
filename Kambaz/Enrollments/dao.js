import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {

  function enrollUserInCourse(userId, courseId) {
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = db.enrollments.filter(
      (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );
    return { message: "Enrollment deleted" };
  }

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
  };
}