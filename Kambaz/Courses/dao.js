import model from "./model.js";
import enrollmentModel from "../Enrollments/model.js";
import { v4 as uuidv4 } from "uuid";
export default function CoursesDao() {
  async function findAllCourses() {
      return await model.find();
  }
  async function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  return await model.create(newCourse);
}
  async function deleteCourse(courseId) {
   return model.deleteOne({ _id: courseId });
}
async function findCoursesForEnrolledUser(userId) {
  const enrollments = await enrollmentModel.find({ user: userId });
  const courseIds = enrollments.map(enrollment => enrollment.course);
  const enrolledCourses = await model.find({ _id: { $in: courseIds } });
  return enrolledCourses;
}
async function updateCourse(courseId, courseUpdates) {
  return await model.updateOne({ _id: courseId }, { $set: courseUpdates });
}
  return { findAllCourses,   findCoursesForEnrolledUser, createCourse, deleteCourse, updateCourse  };
}