import type { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.services";
import { globalResponseHandler } from "../../utility";
import { allowedRoles } from "../../types";

const userRegistration = async (req: Request, res: Response) => {
   const { name, email, password, role } = req.body;
   if(!name || !email || !password){
    return globalResponseHandler(res, {
      statusCode: 400,
      success: false,
      message: "Missing required fields: name, email, and password are required.",
    });
   }
if(await authServices.emailExistsInDB(email)){
  return globalResponseHandler(res, {
    statusCode: 400,
    success: false,
    message: "Email taken. Please use a different email.",
  });
}
  try {
    const {role}=req.body;
    if(role && !allowedRoles.includes(role)) {
      return globalResponseHandler(res, {
        statusCode: 400,
        success: false,
        message: "Invalid role value. Allowed values are: contributor, maintainer",
      });
    }
    const result = await authServices.registerUserIntoDB(req.body);
    globalResponseHandler(res, {
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error:any) {
    globalResponseHandler(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const loginUser=async(req:Request,res:Response)=>{
    try {
        const {token,user}=await authServices.loginUserIntoDB(req.body);
    globalResponseHandler(res,{
        statusCode:200,
        success:true,
        message:"Login successful",
        data:{token,user}

    })
    } catch (error:any) {
        globalResponseHandler(res,{
            statusCode:400,
            success:false,
            message:error.message,
        })
    }
}


export const authController = {
  userRegistration,
    loginUser
};
