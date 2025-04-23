import mongoose from 'mongoose';

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MONGODB connected: ${conn.connection.host}`);
    }catch(err){
        console.log(err);
    }
}

export { connectDB }; 