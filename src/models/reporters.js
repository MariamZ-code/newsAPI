const mongoose=require ("mongoose");
const validator =require ("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/////// Schema for reporters ////////////

const reporterSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:20,
        validate(value){
            if(value < 15){
                throw new Error ("Age must be more than 15 years old" )
            }
        }
    },
    email:{
        type:String,
        trim:true,
        required:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid")
            }
        }
    },

    password:{
        type:String, 
        required:true,
        trim:true,
        minLength:4
    },

    phoneNum:{
        type:Number,
        required:true,
        reim:true,

    },
    

    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ],
    image:{
        type:Buffer,
       
    },

})
///////////// Relation between reporters and their news
reporterSchema.virtual("News",{
    ref:"News",   
    localField:"_id",
    foreignField:"owner"
})

///////////// To Hash Password before saving
reporterSchema.pre("save",async function(next){
   
    const  reporter= this
    if(reporter.isModified("password")){
        reporter.password = await bcrypt.hash(reporter.password,8)
    }
    next()
})

/////// Login by using Email and password

reporterSchema.statics.findByCredentials = async(email,password) =>{
    const reporter = await Reporters.findOne({email})
   

    if(!reporter){
        throw new Error("Unable to login. Please check email or password")
    }

    const isMatch = await bcrypt.compare(password,reporter.password)

    if(!isMatch){
        throw new Error("Unable to login. Please check email or password")
    }

    return reporter
}
//////////// Token

reporterSchema.methods.generateToken = async function(){
    const reporter = this
    const token = jwt.sign({_id:reporter._id.toString()},'node-course')

    
    reporter.tokens = reporter.tokens.concat({token:token})
    await reporter.save()

    return token
}


const Reporters= mongoose.model("Reporters",reporterSchema );

module.exports= Reporters;