import { NextFunction, Request, Response, Router } from "express";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import status from "http-status";
import config from "../../config";
import { userController } from "./user.controller";
import { jwtUtils } from "../../utils/jwt";
import { Role } from "../../../generated/prisma/enums";
import { stat } from "node:fs";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { auth } from "../../middlewares/auth";


const router = Router();



router.post("/register", userController.registerUser)



router.get("/me",auth(Role.ADMIN, Role.AUTHOR, Role.USER),userController.getMyProfile)

router.put("/my-profile",auth(Role.ADMIN,Role.USER,Role.AUTHOR),userController.updateMyProfile)

export const userRouter = router; 