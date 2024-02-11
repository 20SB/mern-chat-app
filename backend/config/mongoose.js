const mongoose = require("mongoose");

const connectDB = async() => {
    try{
        const connDB = await mongoose.connect(`${process.env.MONGO_URI}mern_chat_app`);

        // console.log(`Mongo DB Connected Successfully: ${connDB.connection.host}`);
        console.log(`Mongo DB Connected Successfully.`.cyan);
    }
    catch(err){
        console.log(`Mongo Connection Error ${err}`.red);
        process.exit();
    }
} 

module.exports= connectDB;
