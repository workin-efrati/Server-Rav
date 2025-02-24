import mongoose from 'mongoose';


export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("****  DB - Connection Success ****");
    } catch (err) {
        console.log("Error connecting to Mongo ", err);
    }
}
