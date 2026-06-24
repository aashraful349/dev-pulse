import type { Request, Response } from "express"
import { authServices } from "./auth.services"

const userRegistration=async(req:Request,res:Response)=>{
    try {
        const result=await authServices.registerUserIntoDB(req.body);
    } catch (error) {
        
    }
}


export const authController={
    userRegistration
}