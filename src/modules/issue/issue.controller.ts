import type { Request, Response } from "express";
import { issueServices } from "./issue.services";
import { globalResponseHandler } from "../../utility";

const createIssue = async (req: Request, res: Response) => {
  const reporterID = req.user?.id;
  try {
    const result = await issueServices.createIssueIntoDB(req.body, reporterID);
    globalResponseHandler(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error: any) {
    globalResponseHandler(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllIssues = async(req:Request,res:Response) => {

    const reqQuery={
        sort:req.query.sort as string || null,
        type:req.query.type as string || null,
        status:req.query.status as string || null
    }
    
try {
   const result =await issueServices.getAllIssuesFromDB(reqQuery);
    globalResponseHandler(res,{
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
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

export const issueController = {
  createIssue,
  getAllIssues,
};
