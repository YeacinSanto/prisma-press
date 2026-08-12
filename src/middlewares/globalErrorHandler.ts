// import { NextFunction, Request, Response } from "express"
// import status from "http-status"
// import { Prisma } from "../../generated/prisma/client"



// export const globalErrorHandler = (err:any,req:Request,res:Response,next:NextFunction)=>{
    
//     let statusCode;
//     let errorMessage = err.message
//     let errorName = err.name || "Internal server error"

//     if(err instanceof Prisma.PrismaClientValidationError){
//         statusCode = status.BAD_REQUEST;
//         errorMessage = "You have provided incorrect field type or missing data"
//     }
//     else if(err instanceof Prisma.PrismaClientKnownRequestError){
//         if(err.code === "P2002"){
//             statusCode = status.BAD_REQUEST,
//             errorMessage = "Duplicate key error"
//         }
//         else if(err.code === "P2003"){
//             statusCode = status.BAD_REQUEST,
//             errorMessage = "Foreign key constrain failed"
//         }
//         else if(err.code === "P2025"){
//             statusCode = status.BAD_REQUEST
//             errorMessage = "Requested resources not found"
//         }
//     }
//     else if(err instanceof Prisma.PrismaClientInitializationError){
//         statusCode = status.INTERNAL_SERVER_ERROR;
//         errorMessage = "Authentication error"
//     }
    
//     res.status(status.INTERNAL_SERVER_ERROR).json({
//             success : false, 
//             statusCode : statusCode || status.INTERNAL_SERVER_ERROR,
//             name : errorName,
//             message : errorMessage,
//             error : err.stack
//         })
// }


import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    let statusCode;
    let errorMessage = err.message;
    let errorName = err.name || "Internal server error";

    // Prisma Validation Error
    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = status.BAD_REQUEST;
        errorMessage = "You have provided incorrect field type or missing data";
    }

    // Prisma Known Request Error
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code === "P2002") {
            statusCode = status.BAD_REQUEST;
            errorMessage = "Duplicate key error";
        }

        else if (err.code === "P2003") {
            statusCode = status.BAD_REQUEST;
            errorMessage = "Foreign key constraint failed";
        }

        else if (err.code === "P2025") {
            statusCode = status.NOT_FOUND;
            errorMessage = "Requested resource not found";
        }
    }

    // Prisma Initialization Error
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = status.INTERNAL_SERVER_ERROR;
        errorMessage = "Database connection failed";
    }

    res.status(status.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode,
        name: errorName,
        message: errorMessage,
        error: err.stack
    });
};
