import { Router } from "express";
import { issueController } from "./issue.controller";
import auth from "../../middleware/auth";
import { userRole } from "../../types";

const router = Router();

router.post(
  "/",
  auth(userRole.contributor, userRole.maintainer),
  issueController.createIssue,
);

router.get("/", issueController.getAllIssues);

export const issueRoute = router;
