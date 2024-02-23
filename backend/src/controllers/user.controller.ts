import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiResponse } from "../utils/ApiResponse";
import { AuthRequest } from "../middlewares/auth.middleware";
import jwt, { JwtPayload } from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId: string): Promise<{
        accessToken: string, refreshToken: string
    }> => {
    try {
        const user = await User.findById(userId)
        if(!user){ throw new ApiError(401, 'User not found'); }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.refreshTokenGenerator();
        console.log("refreshToken is: ", refreshToken)
        console.log("accessToken is: ", accessToken)

        user.refreshToken = refreshToken;
        await user?.save({ validateBeforeSave: false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler( async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    console.log("Email: ", email);

    if([username, email, password].some(field => field?.trim() == "")){
        // return res.status(400).json(new ApiError(400, "All fields required!"))
        throw new ApiError(400, "All fields required!");
    }

    // Checking for existed user
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    // if user exist
    if (existedUser) {
        // return res.status(409).json(
        //     new  ApiError(409, `Username or Email already exists`)
        // )
        throw new ApiError(409, `Username or Email already exists`)
    }

    // handling files
    const avatarLocalPath: string | undefined = (req.files as { [fieldname: string]: Express.Multer.File[] })?.avatar?.[0]?.path;

    console.log("file pathis : ", avatarLocalPath)

    let avatar
    if(avatarLocalPath) {
        // upload on cloudinary
        avatar = await uploadOnCloudinary(avatarLocalPath)
        if(!avatar){
            // return res.status(404).json(new ApiError(404, 'Avatar not found'))
            throw new ApiError(404, 'Avatar not found')
        }
    }

    // creating user
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatar?.url || "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    })

    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )

    if(!createdUser){
        // return res.status(500).json(new ApiError(500, "Somethig went wrong while resgitering the user!"))
        throw new ApiError(500, "Somethig went wrong while resgitering the user!")
    }

    // final return
    return res
    .status(201)
    .json(
        new ApiResponse(200, createdUser, "User registered successfully!")
    )

})

const loginUser = asyncHandler( async (req: Request, res: Response) => {

    const { username, email, password } = req.body
    console.log(email);
    if(!username && !email){
        throw new ApiError(400, "Username or Email is required.");
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(!user){ throw new ApiError(400, 'User does not exist!'); }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){ throw new ApiError(400, "Invalid user credentials!"); }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    )

    // to make modifiable only from server not from frontend
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
})

const logOutUser = asyncHandler( async (req: AuthRequest, res: Response ) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
            // when we return response, we will get updated document instead of original one
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler( async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken) throw new ApiError(401, "Unauthorized request")

    try {
        const decodedToken: JwtPayload = jwt.verify(
            incomingRefreshToken, process.env.REFRESH_TOKEN_SECRETE!
        ) as JwtPayload

        const user = await User.findById(decodedToken?._id)

        if(!user) throw new ApiError(401, "Invalid refresh token")

        // comparing refresh tokens from the database of user and incoming one
        if(user.refreshToken  !== incomingRefreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        // if same, generate new accessToken
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken)
        .cookie("refreshToken", newRefreshToken)
        .json( new ApiResponse(
            200, { accessToken, refreshToken: newRefreshToken}, "Access token refreshed"
        ))
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async (req: AuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    if(!user) throw new ApiError(500, "Server error")

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) throw new ApiError(400, "Invalid password")

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Password has been changed successfully")
    )
})

const getCurrentUser = asyncHandler( async (req: AuthRequest, res: Response) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const updateAccountDetails = asyncHandler( async (req: AuthRequest, res: Response) => {
    const { username, email } = req.body //we will be getting new username/ email

    if(!username && !email) {
        throw new ApiError(400, "Username or email required!")
    }

    const isUsernameOrEmailExist = await User.findOne({ $or:  [{ username }, { email }] })
    if(isUsernameOrEmailExist) throw new ApiError(409, "Username or email already exist choose another")

    const updatedObject: any = {}
    if(username) { updatedObject.username = username }
    if(email) { updatedObject.email = email}

    const user = await User.findByIdAndUpdate(
        req.user?._id!,
        { $set: updatedObject },
        { new: true } //return the updated document instead of original one
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated successfully")
    )
})

const updateUserAvatar = asyncHandler( async (req: AuthRequest, res: Response) => {
    // as accepting only one file
    const avatarLocalPath: string | undefined = (req.file as Express.Multer.File)?.path;

    if(!avatarLocalPath) throw new ApiError(400, "Avatar file is missing")

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar?.url) throw new ApiError(400, "Error while uploading on avatar")

    const user = await User.findByIdAndUpdate(
        req.user?.id!,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Avatar updated successfully")
    )
})

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
}