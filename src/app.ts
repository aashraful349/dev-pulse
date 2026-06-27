import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";
import cors from "cors";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Dev-Pulse");
});

app.use("/api/auth", authRoute);
app.use("/api/issues",issueRoute);
app.use(globalErrorHandler);
export default app;
