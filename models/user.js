const mongoose = require("mongoose");
require("dotenv").config(); // If running this file standalone, otherwise app.js covers it

mongoose.connect(process.env.MONGO_URI);

const userSchema=mongoose.Schema({
    username:String,
    name:String,
    age:Number,
    email:String,
    password:String,
    profilepic:{
        type:String,
        default:"default.png"
    },
    posts:[
        {type :mongoose.Schema.Types.ObjectId,ref:"post"}],
    
});

module.exports=mongoose.model('user',userSchema);