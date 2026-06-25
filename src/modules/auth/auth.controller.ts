import type { Request, Response } from "express";
import { authServices } from "./auth.services";
import globalErrorHandler from "../../middleware/globalErrorHandler";
import app from "../../app";
import { globalResponseHandler } from "../../utility";

const userRegistration = async (req: Request, res: Response) => {
  try {
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
            error:error
        })
    }
}


export const authController = {
  userRegistration,
    loginUser
};
