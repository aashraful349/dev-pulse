import bcrypt from "bcryptjs";
import { pool } from "../../db";
import type { IUser, loginCredential } from "../../types";
import jwt from "jsonwebtoken";
import config from "../../config";

const registerUserIntoDB = async (payload: IUser) => {
  const { name, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `
        INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role,created_at,updated_at
        `,
    [name, email, hashedPassword, role],
  );
  return result.rows[0];
};

const loginUserIntoDB = async (payload: loginCredential) => {
  const { email, password } = payload;

  const result = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email],
  );
  if (result.rows.length === 0) {
    throw new Error("User not found");
  }
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Credentials");
  }

  const jwtPlayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  const token = jwt.sign(jwtPlayload,config.jwtSecret as string,{
    expiresIn:"1d"
  });
  return {token,user:jwtPlayload};
};

export const authServices = {
  registerUserIntoDB,
  loginUserIntoDB,
};
