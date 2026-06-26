import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
  // console.log(err.name);
  if(err.name==="JsonWebTokenError"){
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
  else{
    res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
  }
}

export default globalErrorHandler;