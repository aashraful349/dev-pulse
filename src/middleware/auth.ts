import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import { globalResponseHandler } from "../utility";

const auth = (...roles: ROLES[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return globalResponseHandler(res, {
          statusCode: 401,
          success: false,
          message: "Unauthorized: No token provided",
        });
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
        return globalResponseHandler(res, {
          statusCode: 404,
          success: false,
          message: "User not found",
        });
      }

      const user = userData.rows[0];
      if (roles.length && !roles.includes(user.role)) {
        return globalResponseHandler(res, {
          statusCode: 403,
          success: false,
          message:
            "Forbidden: You do not have permission to access this resource",
        });
      }
      req.user = decodedToken;

      next();
    } catch (error) {
      globalResponseHandler(res, {
        statusCode: 500,
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

export default auth;
