import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao() {
  async function findAssignmentsForCourse(courseId) {
    console.log("=== Finding assignments for course:", courseId);
    const assignments = await model.find({ course: courseId });
    console.log("=== Found assignments:", assignments);
    return assignments;
  }

  async function createAssignment(courseId, assignment) {
    const newAssignment = { 
      ...assignment, 
      _id: uuidv4(),
      course: courseId 
    };
    const createdAssignment = await model.create(newAssignment);
    return createdAssignment;
  }

  async function deleteAssignment(assignmentId) {
    const status = await model.deleteOne({ _id: assignmentId });
    return status;
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    const updatedAssignment = await model.findOneAndUpdate(
      { _id: assignmentId },
      { $set: assignmentUpdates },
      { new: true }
    );
    return updatedAssignment;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment
  };
}