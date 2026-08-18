import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponce";
import status from "http-status";


const createCheckoutSession = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(userId as string);

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Checkout session created successfully!",
        data : result
    })
})

export const subscriptionController = {
    createCheckoutSession
}