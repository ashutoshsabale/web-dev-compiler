import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRETE!
});

const uploadOnCloudinary = async (localFilePath: string) => {
    try {
        if(!localFilePath) return null;

        // upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // file has been uploaded successfully
        console.log("File is uploded on cloudinary: ", response.url)

        // unlink file from locals storage
        fs.unlinkSync(localFilePath);

        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath)  // remove the localy saved temperory file as the upload operation got failed
        console.log("Errors: ", error)
        return null;
    }
}

export { uploadOnCloudinary }