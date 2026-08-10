import Jwt,{ JwtPayload, SignOptions, TokenExpiredError } from "jsonwebtoken"

const createToken = (payLoad: JwtPayload, secret:string, expiresIn : SignOptions) =>{
    const token = Jwt.sign(payLoad, secret, {
        expiresIn
    }as SignOptions)

    return token
}

const verifyToken = (token:string, secret:string) => {
    try {
        const verifiedToken = Jwt.verify(token,secret);
        return {
            success : true,
            data : verifiedToken
        }    
    } catch (error:any) {
        throw new Error("Invalid Token")
        return {
            success : false,
            error : error.message
        }
    }
}

export const jwtUtils = {
    createToken,
    verifyToken
}