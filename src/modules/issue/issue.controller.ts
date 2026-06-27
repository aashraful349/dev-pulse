import type { Request, Response } from "express";
import { issueServices } from "./issue.services";
import { globalResponseHandler } from "../../utility";
import { allowedStatuses } from "../../types";

const createIssue = async (req: Request, res: Response) => {
  const reporterID = req.user?.id;
  try {
    const { type } = req.body;
    if (type && !allowedStatuses.includes(type)) {
      return globalResponseHandler(res, {
        statusCode: 400,
        success: false,
        message: "Invalid type value. Allowed values are: bug, feature_request",
      });
    }
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

const getAllIssues = async (req: Request, res: Response) => {
  const reqQuery = {
    sort: (req.query.sort as string) || null,
    type: (req.query.type as string) || null,
    status: (req.query.status as string) || null,
  };

  try {
    const result = await issueServices.getAllIssuesFromDB(reqQuery);
    globalResponseHandler(res, {
      statusCode: 200,
      success: true,
      message: "Issues retrieved successfully",
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

const getIssueByID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await issueServices.getIssueByIDFromDB(id);
    globalResponseHandler(res, {
      statusCode: 200,
      success: true,
      message: "Issue retrieved successfully",
      data: user,
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

const updateIssueByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { status } = req.body;
    if (status && !allowedStatuses.includes(status)) {
      return globalResponseHandler(res, {
        statusCode: 400,
        success: false,
        message:
          "Invalid status value. Allowed values are: open, in_progress, closed",
      });
    }
    const result = await issueServices.updateIssueByIDFromDB(req, id, req.body);
    globalResponseHandler(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
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

const deleteIssueByID = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await issueServices.deleteIssueFromDB(id);
    globalResponseHandler(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error: any) {
    globalResponseHandler(res, {
      statusCode: 500,
      success: false,
      message: error.message,
    });
  }
};
export const issueController = {
  createIssue,
  getAllIssues,
  getIssueByID,
  updateIssueByID,
  deleteIssueByID,
};
