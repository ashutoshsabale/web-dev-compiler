import mongoose from "mongoose";

interface IcodeSchema {
    fullcode: {
        html: string,
        css: string,
        javascript: string
    };
    title: string;
    ownerId: mongoose.Types.ObjectId | string;
    ownerName: string;
    description: string;
    template: string;
}

const codeSchema = new mongoose.Schema<IcodeSchema>({
    fullcode: {
        html: String,
        css: String,
        javascript: String,
    },
    title: {
        type: String,
        required: true,
    },
    template: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    ownerId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    ownerName: String
}, {timestamps: true});

export const Code = mongoose.model("Code", codeSchema);

