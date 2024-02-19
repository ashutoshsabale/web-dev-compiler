import dotenv from "dotenv"
import connectDB from "./db/dbConnect"
import { app } from "./app"

dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`App is listening http://localhost:${process.env.PORT}`);
    })
})
.catch(error => {
    console.log("MongoDB connection failed !!", error);
})
