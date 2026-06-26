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

const getIssueByID=async (req:Request, res:Response)=> {
  
  try {
    const {id}=req.params;
  const user=await issueServices.getIssueByIDFromDB(id)
  globalResponseHandler(res,{
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: user,
    });
  } catch (error:any) {
    globalResponseHandler(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }

}

const updateIssueByID=async (req:Request, res:Response)=> {
const {id}=req.params;
try {
  const result=await issueServices.updateIssueByIDFromDB(req,id,req.body)
  globalResponseHandler(res,{
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
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

}

const deleteIssueByID=async (req:Request, res:Response)=> {
  const {id}=req.params;
  try {
    const result=await issueServices.deleteIssueFromDB(id)
    globalResponseHandler(res,{
        statusCode: 204,
        success: true,
        message: "Issue deleted successfully",
      });
    
  } catch (error:any) {
    globalResponseHandler(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
}
export const issueController = {
  createIssue,
  getAllIssues,
  getIssueByID,
  updateIssueByID,
  deleteIssueByID
};
