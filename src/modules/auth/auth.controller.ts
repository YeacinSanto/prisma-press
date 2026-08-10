import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponce";
import status from "http-status";


const loginUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const payLoad = req.body;

    const {accessToken,refreshToken} = await authService.loginUser(payLoad);

    res.cookie("accessToken",accessToken,{
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge : 100*60*60*24
    })
    
    res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge : 100*60*60*24*7
    })

    sendResponse(res, {
        success : true,
        statusCode : status.OK,
        message : "User login successfully",
        data : {accessToken,refreshToken}
    })
})


export const authController = {
 loginUser   
}