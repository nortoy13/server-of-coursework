import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) return res.status(404).json({ message: "User does not exist" });
    if (existingUser.isBlocked) return res.status(404).json({ message: "This user is  blocked" });
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, "oops", {
      expiresIn: "100h",
    });
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exist" });
    if (confirmPassword !== password)
      return res.status(400).json({ message: "Password do not match" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await User.create({ email, password: hashedPassword, name });
    const token = jwt.sign({ email: result.email, id: result._id }, "oops", {
      expiresIn: "100h",
    });
    res.status(200).json({ result: result, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const unlockUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("no user with that id");
  const user = await User.findByIdAndUpdate(id, { isBlocked: false });
  res.json(user);
};

export const blockUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("no user with that id");
  const updatedUser = await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
  res.json(updatedUser);
};

export const addToAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("no user with that id");
  const updatedUser = await User.findByIdAndUpdate(id, { isAdmin: true }, { new: true });
  res.json(updatedUser);
};

export const rmFromAdmin = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("no user with that id");
  const updatedUser = await User.findByIdAndUpdate(id, { isAdmin: false }, { new: true });
  res.json(updatedUser);
};
