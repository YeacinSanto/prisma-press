import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface"
import Jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payLoad: ILoginUser) => {
    const { email, password } = payLoad;

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email
        }
    })

    if(user.activeStatus==="BLOCKED"){
            throw new Error("Your account is blocked please contact to the support center")
        }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password ")
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    // const accessToken = Jwt.sign(
    //     jwtPayload,
    //     config.jwt_access_secret,
    //     {
    //         expiresIn : config.jwt_access_expires_in
    //     } as SignOptions)

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    // const refreshToken = Jwt.sign(jwtPayload,config.jwt_refresh_secret,{
    //     expiresIn : config.jwt_refresh_expires_in
    // } as SignOptions)

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );
    return {
        accessToken,
        refreshToken
    }

}

export const authService = {
    loginUser
}