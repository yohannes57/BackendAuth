import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = process.env.mongoURI||`mongodb+srv://yonni:123-321@mongopractices.dtymmcp.mongodb.net/?retryWrites=true&w=majority&appName=mongoPractices`;

const connectDB = async () => {
  try {

    mongoose.set('strictQuery', false)
    await mongoose.connect('mongodb+srv://yonni:123-321@sba-mongodb.wsojrxs.mongodb.net/?retryWrites=true&w=majority&appName=SBA-mongodb', {
      useNewUrlParser: true,
    });

    console.log('Mongo DB Connected...');
  } catch (err) {
    console.error(err.message);
console.log("sth wrong")
    process.exit(1);
  }
};

export default connectDB;
