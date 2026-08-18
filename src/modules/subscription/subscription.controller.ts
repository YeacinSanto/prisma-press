import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { subscriptionService } from "./subscription.service";
import { sendResponse } from "../../utils/sendResponce";
import status from "http-status";


const createCheckoutSession = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId = req.user?.id;

    const result = await subscriptionService.createCheckoutSession(userId as string);

    console.log(result)

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Checkout session created successfully!",
        data : result
    })
})


const handleWebhook = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const event = req.body as Buffer; //normally req.boy is a payload but here we use raw thats way its string
    const signature = req.headers['stripe-signature']!
    console.log("inside controller webhook")
    await subscriptionService.handleWebhook(event,signature as string)


    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Webhook triggered successfully!",
        data : null
    })
})

export const subscriptionController = {
    createCheckoutSession,
    handleWebhook
}