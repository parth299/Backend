import connectDB from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config({
    path: './env'
})



connectDB();












/*
import express from 'express';

const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        app.on("error", (eeor)=>{
            console.log("Express application cant talk to database: ", error);
            throw error;
        })

        //Connection well established and express app can talk to database
        app.listen(process.env.PORT, ()=>{
            console.log("App is listening at the port : ", process.env.PORT);
        })
    } catch (error) {
        console.log("Error: ", error);
        throw error;
    }
} )()
*/