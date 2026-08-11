import cookieParser from "cookie-parser";
import express,{ Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import status from "http-status";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";
import { userRouter } from "./modules/users/user.route";
import { authRoute } from "./modules/auth/auth.routes";
import { commentRoutes } from "./modules/comment/comment.route";
import { postRoutes } from "./modules/post/post.route";


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
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)

export default app;