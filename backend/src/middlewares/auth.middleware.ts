// This middleware is  for checking if the user has a valid session.

import { NextFunction, Request, Response, json } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken"
import { IUserSchema, User } from "../models/user.model";

// Define a custom interface that extends the Request interface
export interface AuthRequest extends Request {
    user?: IUserSchema;
    // Define the user property as optional and of type User
}

export const verifyJWT = asyncHandler( async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token) throw new ApiError(401, "Unauthorized request");

        const decodedToken: JwtPayload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRETE!) as JwtPayload

        // console.log("Decoded Token is: ", decodedToken)

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )

        if(!user) throw new ApiError(401, "Invalid Access Token")

        req.user = user
        next()
    } catch (error) {
        return res
        .status(401)
        .json( new ApiError(401, "Unauthorized request" ))
    }
})