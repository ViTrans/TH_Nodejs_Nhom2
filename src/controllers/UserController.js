import bcrypt from "bcryptjs";
import { insertUser as insertUserModel } from "../models/user";
import { getAllUser as getAllUserModel } from "../models/user";
import { userDetails as userDetailsModel } from "../models/user";
import { updateUser as updateUserModel } from "../models/user";
import { deleteUser as deleteUserModel } from "../models/user";
import { checkUser as checkUserModel } from "../models/user";
export const createUser = (req, res) => {
  return res.render("home", {
    data: { title: "Tạo tài khoản", page: "newUser" },
  });
};

export const getAllUser = async (req, res) => {
  try {
    const [users, fields] = await getAllUserModel();
    return res.render("home", {
      data: {
        title: "Danh sách tài khoản",
        page: "listUser",
        users: users.length > 0 ? users : [],
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const insertUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // model insert user
    const [user, fields] = await insertUserModel(req.body, hashedPassword);
    console.log("user inser ", user);

    if (user.affectedRows === 1) res.redirect("/list-user");
  } catch (error) {
    console.log(error);
  }
};

// export const getListUser = (req, res) => {
//   const { page = 1 } = req.params;
//   const perPage = 5;
//   const from = (page - 1) * perPage + 1;
//   const to = page * perPage;
//   return res.render("home", {
//     data: {
//       title: "Danh sách tài khoản",
//       page: "listUser",
//       params: `${from} - ${to}`,
//     },
//   });
// };
export const detailUser = async (req, res) => {
  try {
    const { username } = req.params;
    const [user, fields] = await userDetailsModel(username);
    console.log("user detail ", user);
    return res.render("home", {
      data: {
        title: "Chi tiết tài khoản",
        page: "detailUser",
        user: user.length > 0 ? user[0] : {},
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const editUser = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("username ", username);
    const [user, fields] = await userDetailsModel(username);
    console.log("user edit ", user);
    return res.render("home", {
      data: {
        title: "Cập nhật tài khoản",
        page: "editUser",
        user: user.length > 0 ? user[0] : {},
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    console.log("user update ", req.body);
    const [user, f] = await updateUserModel(req.body);
    if (user.affectedRows == 1) {
      return res.redirect("/list-user");
    }
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const [user, fields] = await deleteUserModel(username);
    if (user.affectedRows == 1) {
      return res.redirect("/list-user");
    }
    res.redirect("/");
  } catch (error) {
    res.redirect("/");
  }
};

export const login = (req, res) => {
  res.render("home", {
    data: {
      title: "Đăng nhập",
      page: "login",
    },
  });
};

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [user, fields] = await checkUserModel(email);
    console.log("user ", user);
    if (user.length > 0) {
      const checkPassword = bcrypt.compareSync(password, user[0].password);
      if (checkPassword) {
        req.session.user = user;
        return res.redirect("/list-user");
      }
    }
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};
