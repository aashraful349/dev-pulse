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
router.get("/:id",issueController.getIssueByID);
router.patch("/:id",auth(userRole.contributor,userRole.maintainer),issueController.updateIssueByID);
router.delete("/:id",auth(userRole.maintainer),issueController.deleteIssueByID);

export const issueRoute = router;
