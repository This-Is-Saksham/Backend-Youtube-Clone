import connectDB from "./db/index.js";
import dotenv  from "dotenv";
import express from "express"

const app = express()

dotenv.config({
    path : './env'
})



connectDB()// executing the connect function   
.then(() => {
    app.on("error", (error)=> {
        console.log("ERROR", error)
        throw error
    })
    app.listen( process.env.PORT || 8000, () => {
        console.log(`App is listening on PORT ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.log("MongoDB connection Failed ", error);
})