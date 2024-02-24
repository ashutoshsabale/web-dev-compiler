import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Code } from "../models/code.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

interface FullCodeType {
    html: string;
    css: string;
    javasript: string;
}

const saveCode = asyncHandler ( async (req: AuthRequest, res: Response ) => {
    const { fullcode, title } = req.body
    const user = req.user?._id

    // if(!user) throw new ApiError(401, 'User not authenticated')

    const newCode = await Code.create({
        fullcode: fullcode,
        title
    })

    return res
    .status(200)
    .json(
        new ApiResponse(200, newCode, "Successfully created a code")
    )

})

const loadCode = asyncHandler ( async (req: Request, res: Response ) => {
    const { postId } = req.body
    console.log('Post Id is: ', postId)

    const existingCode = await Code.findById(postId)

    if (!existingCode) throw new ApiError(404, "Code not found")

    return res
    .status(200)
    .json(
        new ApiResponse(200, existingCode, "Successfully loaded the code")
    )
})

const getAllCodes = asyncHandler ( async (req: Request, res: Response) => {
    const allCode = await Code.find( {} ).sort({ createdAt : -1 })

    return res
    .status(200)
    .json(
        new ApiResponse(200, allCode, "Successfully retrieved codes")
    )
})

export {
    saveCode,
    getAllCodes,
    loadCode,
}