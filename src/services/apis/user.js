import { getAllUser as getAllUserModel } from "../../models/user";
import { updateUser as updateUserMd } from "../../models/user";
import { deleteUser as delUserModel } from "../../models/user";
import { userDetails as detailUserMd } from "../../models/user";
import { insertUser as insertUserMd } from "../../models/user";
import { login as loginMd } from "../../models/user";
import { signAccessToken } from "./auth";
import bcrypt from "bcryptjs";

export const getAll = async (req, res) => {
  const users = await getAllUserModel();
  console.log("users ", users);
  return res.status(200).json({
    users: users.length > 0 ? users[0] : [],
    message: "get all user",
  });
};

export const edit = async (req, res) => {
  //
  const [user, f] = await updateUserMd(req.body);
  if (user.affectedRows <= 0) {
    return res.status(400).json({
      message: "khong the edit user",
    });
  }
  return res.status(200).json({
    message: "edit user success",
  });
};

export const deleleUser = async (req, res) => {
  const username = req.params.username;
  const [user, f] = await delUserModel(username);
  if (user.affectedRows <= 0) {
    return res.status(400).json({
      message: "Something Went Wrong",
    });
  }
  return res.status(200).json({
    message: "delete user succes",
  });
};
export const detail = async (req, res) => {
  const username = req.params.username;
  const [user, f] = await detailUserMd(username);
  if (user.length < 0) {
    return res.status(400).json({
      message: "user Not found",
    });
  }
  return res.status(200).json({
    message: "get current user account",
    user: user[0],
  });
};

export const register = async (req, res) => {
  //
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // model insert user
    const [user, fields] = await insertUserMd(req.body, hashedPassword);
    return res.status(200).json({
      message: "register success",
    });
  } catch (error) {
    // 409 duplicate  username
    res.status(409).json({
      message: error,
    });
  }
};
export const loginApi = async (req, res) => {
  //
  const { password, username } = req.body;
  const [user, f] = await loginMd(username);
  const hashedPassword = user[0].password;

  const isMatched = bcrypt.compareSync(password, hashedPassword);
  if (!isMatched) return res.status(400).json({ message: "password no match" });
  // xoa key password ko can thiet tu ket qua CSDL
  delete user[0]["password"];

  // signt token
  const tokenUser = await signAccessToken({
    username: user[0].username,
    role: user[0].role,
  });

  return res.status(200).json({
    message: "login success",
    token: tokenUser,
    user,
  });
};

export const logout = async (req, res) => {
  //
  return res.status(200).json({
    message: "logout success",
  });
};

export default {
  getAll,
  edit,
  deleleUser,
  detail,
  register,
  loginApi,
  logout,
};
