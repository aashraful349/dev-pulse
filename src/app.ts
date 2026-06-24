import express, { type Application, type Request, type Response } from "express";
import globalErrorHandler from "./middleware/glbalErrorHandler";
import { authRoute } from "./modules/auth/auth.route";


const app:Application = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.text());


app.get("/",(req:Request,res:Response)=>{
    res.send("Welcome to Dev-Pulse");
})

app.use("/api/auth",authRoute);
app.use(globalErrorHandler);
export default app;
