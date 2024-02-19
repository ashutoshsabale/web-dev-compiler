import mongoose from "mongoose";

interface ITest {
    name: string;
}

const testSchema = new mongoose.Schema<ITest>({
    name: String,
})

export const Test = mongoose.model("Test", testSchema);

