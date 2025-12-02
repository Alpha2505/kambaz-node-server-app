import { v4 as uuidv4 } from "uuid";
import model from "../Courses/model.js";
import ModulesModel from "./model.js"

export default function ModulesDao() {
  async function findModulesForCourse(courseId) {
    console.log("=== Finding modules for course:", courseId);
    const modules = await ModulesModel.find({ course: courseId });
    console.log("=== Found modules:", modules);
    return modules;
  }

  async function createModule(courseId, module) {
    const newModule = { 
      ...module, 
      _id: uuidv4(),
      course: courseId  // Link to the course
    };
    const createdModule = await ModulesModel.create(newModule);
    return createdModule;
  }

  async function deleteModule(courseId, moduleId) {
    const status = await ModulesModel.deleteOne({ 
      _id: moduleId, 
      course: courseId 
    });
    return status;
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const updatedModule = await ModulesModel.findOneAndUpdate(
      { _id: moduleId, course: courseId },
      { $set: moduleUpdates },
      { new: true }  // Return the updated document
    );
    return updatedModule;
  }

  return {
    findModulesForCourse,
    createModule,
    deleteModule,
    updateModule
  };
}