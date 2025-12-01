import model from "./model.js";
import { v4 as uuidv4 } from "uuid";
import enrollmentModel from "../Enrollments/model.js";
export default function UsersDao() {
  const createUser = (user) => {
  const newUser = { ...user, _id: uuidv4() };
  return model.create(newUser);
}
  const findAllUsers = async () => await model.find();
  const findUserByUsername = async (username) => await model.findOne({ username: username });
  const findUserByCredentials = async (username, password) => await model.findOne({ username, password });
  const findUsersForCourse = async (courseId) => {
    const enrollments = await enrollmentModel.find({ course: courseId });
    const userIds = enrollments.map(enrollment => enrollment.user);
    const users = await model.find({ _id: { $in: userIds } });
    return users;
  };
  const findUsersByRole = (role) => model.find({ role: role });
  const findUsersByPartialName = (partialName) => {
  const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
  return model.find({
    $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
  });
};
 const findUserById = (userId) => model.findById(userId);
 const deleteUser = (userId) => model.findByIdAndDelete( userId );
 const updateUser = (userId, user) => model.updateOne({ _id: userId }, { $set: user });
  return { createUser, findAllUsers, findUserById, findUserByUsername, findUserByCredentials, updateUser, deleteUser, findUsersForCourse, findUsersByRole, findUsersByPartialName };
}
