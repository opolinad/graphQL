import mongoose from "mongoose";
import dontenv from "dotenv";
dontenv.config();
export const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log('MongoDB Connected!!'))
    .catch((err)=>console.log('Error', err))
}