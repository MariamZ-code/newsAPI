const mongoose= require("mongoose");
 
const newsSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    descraption:{
        type:String,
        required:true,
        trim:true
    },
    image:{
        type:Buffer
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true 
    }
})

const News = mongoose.model("News" ,newsSchema);


module.exports= News;   