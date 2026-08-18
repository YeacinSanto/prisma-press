import cookieParser from "cookie-parser";
import express,{ Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRouter } from "./modules/users/user.route";
import { authRoute } from "./modules/auth/auth.routes";
import { commentRoutes } from "./modules/comment/comment.route";
import { postRoutes } from "./modules/post/post.route";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { subscriptionRoutes } from "./modules/subscription/subscription.route";
import { stripe } from "./lib/stripe";


const app : Application = express();

app.use(cors({
    origin : config.app_url,
    credentials : true
}))

app.use("/api/subscription/webhook", (req, res, next) => {
    console.log("WEBHOOK REQUEST RECEIVED");
    next();
});


app.use("/api/subscription/webhook",express.raw({type:"application/json"}))

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
app.use("/api/subscription", subscriptionRoutes)


app.use(notFound)

app.use(globalErrorHandler)

export default app;