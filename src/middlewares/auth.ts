import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwt";
import config from "../config";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";


declare global {
    namespace Express {
        interface Request {
            user?: {
                email: string,
                name: string,
                id: string,
                role: Role
            }
        }
    }
}



export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization?.split(" ")[1]
                : req.headers.authorization;

        if (!token) {
            throw new Error("You are not logged in. Please login first")
        }

        const verifyToken = jwtUtils.verifyToken(token, config.jwt_access_secret)


        if (verifyToken.success === false) {
            throw new Error(verifyToken.error)
        }

        const { email, name, id, role } = verifyToken.data as JwtPayload;

        if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error("Forbidden! you do not have permission")
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                email,
                name,
                role
            }
        })

        if (!user) {
            throw new Error("User not found, please login again")
        }

        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account is blocked please contact to the support center")
        }

        req.user = {
            email,
            name,
            id,
            role
        }
        next()

    })
}
