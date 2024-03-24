import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDb connected!! and connection instance is : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error while connecting to database : ", error);
        process.exit(1);
    }
}
 export default connectDB;