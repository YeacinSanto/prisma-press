import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import status from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/users/user.route";
import { authRoute } from "./modules/auth/auth.routes";


const app : Application = express();

app.use(cors({
    origin : config.app_url,
    credentials : true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/",(req:Request, res:Response)=>{
    res.send("Hello world")
})


app.use("/api/users",userRouter)
app.use("/api/auth", authRoute)

export default app;