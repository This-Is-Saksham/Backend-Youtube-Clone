import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended : true, limit: "16kb"}))
app.use(express.static("public"))

// import Routes
import userRouter from "./routes/user.routes.js";
// routes declaration
// app.get // tab kar rhe the jab app.get me router or controller likh rhe the, abb router alag likh rakha hai hmne to abb router to lane ke liye middleware lana hoga 

app.use("/api/v1/users", userRouter)
// agar koi user "./user route pe jayega to vo userRouter pe redirect ho jayega"

// Jo './user' hai vo prefix ho jata hai, jaisehe user '/users' pe jayega to 'userRouter' activate ho jayega, vha jane ke baad agar '/register' method lagega to registerUser method call ho jayega [orr sab thik rha to message okk call ho jayega]




export {app}