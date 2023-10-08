import express from "express";
const router = express.Router();
import getHomePage from "../controllers/HomeController";
import getAboutPage from "../controllers/AboutController";
import { isLogin, allowedRoles } from "../middleware/auth";
import {
  createUser,
  login,
  detailUser,
  insertUser,
  getAllUser,
  updateUser,
  editUser,
  deleteUser,
} from "../controllers/UserController";
import { loginUser, logout } from "../controllers/AuthController";
import api, { getAll } from "../services/apis/user";
import { verifyAccessToken } from "../services/apis/auth";

const initWebRoute = (app) => {
  router.get("/", getHomePage);
  router.get("/about", getAboutPage);
  router.get("/create-new-user", isLogin, createUser);
  router.post("/insert-new-user", isLogin, insertUser);
  router.get("/login", login);
  router.post("/login", loginUser);
  router.get("/list-user", getAllUser);
  router.get(
    "/detail-user/:username?",
    isLogin,
    allowedRoles(["admin", "user"]),
    detailUser
  );
  router.post(
    "/update-user",
    isLogin,
    allowedRoles(["admin", "user"]),
    updateUser
  );
  router.get(
    "/edit-user/:username",
    isLogin,
    allowedRoles(["admin", "user"]),
    editUser
  );
  router.get("/delete-user/:username", deleteUser);
  router.get("/logout", logout);

  // api
  router.get("/api/v1/users", getAll);
  router.get("/api/v1/users/:username", api.detail);
  router.post("/api/v1/users", api.register);
  router.put("/api/v1/users", verifyAccessToken, api.edit);
  router.delete("/api/v1/user/:username", verifyAccessToken, api.deleleUser);
  router.post("/api/v1/login", api.loginApi);
  router.get("/api/v1/logout", api.logout);
  router.get("*", (req, res) => {
    res.send("Lỗi 404, không tìm thấy trang");
  });
  return app.use("/", router);
};

export default initWebRoute;
