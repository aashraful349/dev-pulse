import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("Unauthorized: No token provided");
      }
      const decodedToken = (await jwt.verify(
        token as string,
        config.jwtSecret as string,
      )) as JwtPayload;
      const userData = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `,
        [decodedToken.email],
      );

      if (userData.rows.length === 0) {
        throw new Error("unauthorized");
      }

      const user = userData.rows[0];
      if (roles.length && !roles.includes(user.role)) {
        throw new Error(
          "Forbidden: You do not have permission to access this resource",
        );
      }
      req.user = decodedToken;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
