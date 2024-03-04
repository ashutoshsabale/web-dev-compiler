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

const saveCode = asyncHandler ( async (req: AuthRequest, res: Response) => {
    console.log(req.body)

    const { fullcode: fullcodeJSON, title, description } = req.body

    console.log("Fullcode for saving is: ", fullcodeJSON)

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
        template: template?.url || "https://cdn.pixabay.com/photo/2019/07/16/18/18/frontend-4342425_1280.png",
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

const editCode = asyncHandler ( async (req: AuthRequest, res: Response) => {
    console.log(req.body)

    const user = await User.findById(req.user?._id)
    if(!user) throw new ApiError(401, "Unauthorized request, Please login.")

    const {codeId} = req.params
    console.log("Requested code id for edit is: ", codeId)

    const { fullcode: fullcodeJSON, title, description } = req.body

    let fullcode;
    console.log("Fullcode for updation is: ", fullcodeJSON)
    console.log("Requested code title is: ", title)
    console.log("Requested  code desc is :", description)
    if (fullcodeJSON) {
        try {
            fullcode = JSON.parse(fullcodeJSON);
            console.log("Json parsed fullcode is: ", fullcode)
        } catch (error) {
            throw new ApiError(400, "Invalid JSON format for 'fullcode'");
        }
    }

    // const existingCode = await Code.findById(codeId)
    // if(!existingCode) throw new ApiError(404, "Code not found")

    const updatedCode = await Code.findByIdAndUpdate(
        codeId,
        {
            $set: {
                fullcode,
                title: title,
                description: description,
            }
        },
        { new: true }
    )

    if(!updatedCode) throw new ApiError(500, "Somethig went wrong while updating the code details!")

    const templatePath: string | undefined = (req.file as Express.Multer.File)?.path;

    let updatedTemplate
    if(templatePath){
        updatedTemplate = await uploadOnCloudinary(templatePath)
        if(!updatedTemplate) throw new ApiError(404, "Template not found")
    }

    if(updatedTemplate) updatedCode.template = updatedTemplate.url
    await updatedCode.save()

    return res
    .status(200)
    .json(new ApiResponse(200, updatedCode, 'Updated code successfully'))
})

const loadCode = asyncHandler ( async (req: Request, res: Response) => {
    const { postId } = req.body

    const existingCode = await Code.findById(postId)

    if (!existingCode) throw new ApiError(404, "Code not found")

    return res
    .status(200)
    .json(
        new ApiResponse(200, existingCode, "Successfully loaded the code")
    )
})

const getUserCodes = asyncHandler( async (req: AuthRequest, res: Response) => {
    const {username} = req.params

    const user = await User.findOne({username})

    if(!user) throw  new ApiError(401, "User not found! Please login again.")

   const ownerId = user._id

    const savedCodes = await Code.find({ownerId})

    return res
    .status(201)
    .json(
        new ApiResponse(201, savedCodes, "Saved codes fetched successfull")
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

const deleteCode = asyncHandler( async (req: AuthRequest, res: Response) => {
    const { id } = req.body
    console.log("request delete for codeid: ", new Object(id))

    const user = await User.findById(req.user?._id)

    if(!user)  throw new ApiError(401, "Unauthorized access. Login to continue")
    const newSavedCodeAfterDelete = user.savedCodes.filter( codeid => codeid.toString() !== id)
    console.log("newSavedCodeAfterDelete: ", newSavedCodeAfterDelete)
    user.savedCodes = newSavedCodeAfterDelete;
    await user.save()

    const deletedCode = await Code.findByIdAndDelete(id)

    return res
    .status(200)
    .json( new ApiResponse(200, {deletedCode, new: newSavedCodeAfterDelete}, "Code removed successfully!"))
})


export {
    saveCode,
    getAllCodes,
    loadCode,
    getUserCodes,
    deleteCode,
    editCode,
}