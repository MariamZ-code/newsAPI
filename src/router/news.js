const express = require("express");
const News = require("../models/news");
const newsRouter = new express.Router()
const auth = require("../middleware/auth");
const multer=require ("multer")
///// post News 
newsRouter.post('/news',auth,async(req,res)=>{
   
    const news = new News({...req.body,owner:req.reporter._id})
    try{
        await news.save()
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})
 


/////////////////// Get All

newsRouter.get("/news",auth,async(req,res)=>{
    try{
       await req.reporter.populate("news").execPopulate()
       res.send(req.reporter.news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

/////////////////// Get By ID

newsRouter.get("/news/:id",auth,async(req,res)=>{
    const _id = req.params.id
    try{
        
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send('Task not found')
        }
        res.status(200).send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

///////////////// Patch
newsRouter.patch("/news/:id",auth,async(req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    try{
       
        const news = await News.findOne({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send("News is not found " )
        }
        updates.forEach((update)=> news[update] = req.body[update])
        await news.save()
        res.send(news)
    }
    catch(e){
        res.status(400).send(e)
    }

})

///////////////// Delete
newsRouter.delete("/news/:id",auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const news = await News.findOneAndDelete({_id,owner:req.reporter._id})
        if(!news){
            return res.status(404).send("News not found")
        }
        res.send(news)
    }
    catch(e){
        res.status(400).send(e)
    }
})

//////// Upload Image
const upload = multer({
    limits:{
        fileSize: 1000000   
    },
    fileFilter(req,file,cb){
       
       if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
          return  cb(new Error("Please upload an image"))
        } 
        cb(null, true)  
    }
})

newsRouter.post("/news/image",auth,upload.single("image"),async(req,res)=>{
    try{
        news.img = req.file.buffer
        await news.save()
        res.send("Image uploaded")
    }
    catch(e){
        res.send(e)
    }
})


module.exports= newsRouter;