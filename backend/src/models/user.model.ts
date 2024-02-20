import mongoose, { Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


interface IUserSchema extends Document {
    username: string;
    email: string;
    password: string;
    avatar: string;
    savedCodes: Array<mongoose.Types.ObjectId>;
    refreshToken: string;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

const userSchema = new mongoose.Schema<IUserSchema>({
    username: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        trim: true
    },
    avatar: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    savedCodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Code"
    }],
    refreshToken: {
        type: String,
    }
},{timestamps: true})

userSchema.pre<IUserSchema>("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.isPasswordCorrect = async function(this: IUserSchema,password: string): Promise<boolean>{
    return await bcrypt.compare(password, this.password)
}


userSchema.methods.generateAccessToken = function(this: IUserSchema):string {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        process.env.ACCESS_TOKEN_SECRETE as string,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string
        }
    )
}

userSchema.methods.generateRefreshToken = function(this: IUserSchema):string {
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRETE as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string
        }
    )
}

userSchema.methods.generateRefreshToken = function(){

}

export const User = mongoose.model("User", userSchema);