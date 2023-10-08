import connectDb from "../configs/connectDb";
const bcrypt = require("bcryptjs");

export const insertUser = async (body, hashPassword) => {
  try {
    const { username, fullname, address, sex, email, groupid } = body;
    const db = await connectDb();
    return await db.execute(
      "INSERT INTO `users` (`username`, `password`, `fullname`, `address`, `sex`, `email`, `groupid`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, hashPassword, fullname, address, sex, email, groupid]
    );
  } catch (error) {
    console.log(error);
  }
};

export const getAllUser = async () => {
  try {
    const db = await connectDb();
    return await db.execute("SELECT * FROM `users`");
  } catch (error) {
    console.log(error);
  }
};

export const userDetails = async (username) => {
  try {
    const db = await connectDb();
    return await db.execute("SELECT * FROM `users` WHERE `username` = ?", [
      username,
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (body) => {
  try {
    const db = await connectDb();
    const { fullname, password, address, sex, email, groupid, username } = body;
    let sql =
      "UPDATE `users` SET fullname = ?, address = ?, sex = ?, password = ?,email = ?,groupid = ? WHERE username = ?";

    if (!password) {
      sql =
        "UPDATE `users` SET fullname = ?, address = ?, sex = ?,email = ?,groupid = ? WHERE username = ?";

      return await db.execute(sql, [
        fullname,
        address,
        sex,
        email,
        groupid,
        username,
      ]);
    } else {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);
      return await db.execute(sql, [
        fullname,
        address,
        sex,
        hashedPassword,
        email,
        groupid,
        username,
      ]);
    }
  } catch (error) {
    console.log("err ", error);
  }
};

export const deleteUser = async (username) => {
  try {
    const db = await connectDb();
    return await db.execute("DELETE FROM `users` WHERE `username` = ?", [
      username,
    ]);
  } catch (error) {
    console.log(error);
  }
};

export const login = async (username) => {
  try {
    const db = await connectDb();
    return await db.execute(
      "SELECT  users.*, group.role FROM `users` INNER JOIN `group` ON users.groupid = `group`.id where username = ? ",
      [username]
    );
  } catch (error) {
    console.log("err ", error);
  }
};
