const express = require("express");
const repoRouter = new express.Router();

const Reporter = require("../models/reporters");
const auth = require("../middleware/auth");
const multer = require("multer");



//////// Upload Image
const upload = multer({
    limits:{
        fileSize: 1000000  
    },
    fileFilter(req,file,cb){
        
       if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
          return  cb(new Error('Please upload an image'))
        } 
        cb(null, true)  
    }
})
///////// add image

repoRouter.post("/reporter/image", auth, upload.single('image'),async(req,res)=>{
    try{
        req.reporter.image = req.file.buffer
        await req.reporter.save()
        res.send("Image uploaded")
    }
    catch(e){
        res.send(e)
    }
})


//////////////////////// Add new reporters
repoRouter.post("/reporter", async (req, res) => {
   
    const reporter = new Reporter(req.body)
    try{
       await reporter.save()
       const token = await reporter.generateToken()
       res.status(200).send({reporter,token})
    }
    catch(e){
        res.status(400).send(e)
    }
 
})
////////////// LOGIN by using email and password  
repoRouter.post("/reporter/login",async(req,res)=>{
    try{
        const reporter = await Reporter.findByCredentials(req.body.email,req.body.password)
        const token = await reporter.generateToken()
        res.send({reporter,token})
    }
    catch(e){
        res.send('Try again ' + e)
    }
})


////////// GET ALL

repoRouter.get("/reporter",auth, (req, res) => {
    Reporter.find({}).then((reporter) => {
        res.status(200).send(reporter)
    }).catch((e) => {
        res.status(400).send("Try again " + e)
    })
})
////// Get BY reporter's ID

 repoRouter.get("/reporter/:id" ,auth, (req,res)=> {

    const _id= req.params.id
    
    Reporter.findById(_id).then((reporter)=>{ 
        if(!reporter){
         return  res.status(404).send(reporter)
        }
        res.status(200).send(reporter)
    
    }).catch((e)=>{
        res.status(500).send(e)
    })
})




////////////// Update BY ID

repoRouter.patch("/reporter/:id",auth, async (req, res) => {
    const updates = Object.keys(req.body)
    console.log(updates)
    const _id = req.params.id;
    try {
        
        const reporter = await Reporter.findById(_id)
        
        if (!reporter) {
            return res.send("No reporter is found");
        }
        updates.forEach((update) => reporter[update] = req.body[update])
        await reporter.save();

        res.status(200).send(reporter);
    } catch (e) {
        res.status(400).send('Error' + e);
    }
})



////////////// LOGOUT 
repoRouter.delete("/reporter/logout",auth,async(req,res)=>{
    try{
        req.reporter.tokens = req.reporter.tokens.filter((el)=>{
        
            return el.token !== req.token
        })
        await req.reporter.save()
        res.send("Logout Successfully")
    }
   
    catch(e){
        res.send(e)
    }
})





/////// Delete BY reporter's ID
repoRouter.delete("/reporter/:id",auth, async (req, res) => {
    const _id = req.params.id
    try {
        const reporter = await Reporter.findByIdAndDelete(_id)
        if (!reporter) {
            return res.send("reporter  is Not found")
        }
        res.send(reporter)
    }
    catch (e) {
        res.send(e)
    }
})






module.exports = repoRouter;
