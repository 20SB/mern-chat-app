const mongoose = require("mongoose");
const env = require('./environment');

const connectDB = async() => {
    try{
        const connDB = await mongoose.connect(`${env.db}mern_chat_app`);

        // console.log(`Mongo DB Connected Successfully: ${connDB.connection.host}`);
        console.log(`Mongo DB Connected Successfully.`.cyan);
    }
    catch(err){
        console.log(`Mongo Connection Error ${err}`.red);
        process.exit();
    }
} 

module.exports= connectDB;
