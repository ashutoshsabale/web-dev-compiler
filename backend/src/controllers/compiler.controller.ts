import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Code } from "../models/code.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";

interface FullCodeType {
    html: string;
    css: string;
    javasript: string;
}

const saveCode = asyncHandler ( async (req: AuthRequest, res: Response ) => {
    const { fullcode: fullcodeJSON, title, description } = req.body

    // we are using formData in frontend so we can not object to fullcode directly, so we need to convert the fullcode to json format and then pass it.

    // But in the backend we need fullcode in object format so we have to use json parser
    const fullcode = JSON.parse(fullcodeJSON)

    if([title, description].some(field => field.trim() == "")){
        return res
        .status(400)
        .json(new ApiError(400, "Title and Description fields cannot be empty"))
    }

    const templatePath: string | undefined = (req.file as Express.Multer.File)?.path;

    console.log("Bhaisahab template aa gaya!", templatePath)

    let template
    if(templatePath){
        template = await uploadOnCloudinary(templatePath);
        if(!template) throw new ApiError(404, 'Template image not found');
    }

    const user = await User.findById(req.user?._id)
    console.log("User who saving code: ", user)

    if(!user) throw new ApiError(401, 'User not authenticated')

    const newCode = await Code.create({
        fullcode: fullcode,
        title,
        description,
        template: template?.url || "https://assets-global.website-files.com/5e4c6b4b7ed0a2e77458ce3d/638a92cf349604581a35fe75_263a75529a1752b75d64f9f21fd07c92-3-2.jpeg",
        ownerId: user._id,
        ownerName: user.username
    })

    if(!newCode) throw new ApiError(500, 'Failed to create a new code')

    user.savedCodes.push(newCode._id)
    await user.save()

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

const getMyCodes = asyncHandler( async (req: AuthRequest, res: Response) => {

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