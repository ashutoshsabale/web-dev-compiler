import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Routes
import userRouter from "./routes/user.routes"
import compilerRouter from "./routes/compiler.routes"

// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/compiler", compilerRouter)


export { app }