import { NextFunction, Request, RequestHandler, Response } from "express";
import status from "http-status";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponce";
import Jwt from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";
import { error } from "node:console";






const registerUser = catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    const payLoad = req.body;

    const user = await userService.registerUserIntoDB(payLoad);
    sendResponse(res,{
        success : true,
        statusCode : status.CREATED,
        message : "User created successfully",
        data : {user}
    })
})

const getMyProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    

    const profile = await userService.getMyProfileFromDB(req.user?.id as string)

    sendResponse(res, {
        success : true,
        statusCode : status.OK,
        message : "user profile fetched successfully!",
        data : {profile}
    })

})



const updateMyProfile = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.user?.id as string;

    const payLoad = req.body;

    const updateProfile = await userService.updateMyProfileInDB(userId,payLoad);

     sendResponse(res, {
        success : true,
        statusCode : status.OK,
        message : "user profile updated successfully!",
        data : {updateProfile}
    })

})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}