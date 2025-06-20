import mongoose from 'mongoose'

const connectDB = async () =>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/chai`)
        console.log("Database Connected")
    }
    catch(error){
        console.log(error)
    }
}

export default connectDB