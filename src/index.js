import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config({
    path: './env'
})


//Asynchronous method returns a promise, use .then,catch
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is listening at port: ${process.env.PORT}`);
    }) 
})
.catch((err)=>{
    console.log("MongoDB connection falied! ", err);
})












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