const jwt = require('jsonwebtoken')
const Reporter = require('../models/reporters')
const auth = async (req,res,next) =>{
    

    try{

        const token = req.header('Authorization').replace('Bearer ','')
        console.log(token)

        
        const decode = jwt.verify(token,'node-course')
        console.log(decode)

        const reporter = await Reporter.findOne({_id:decode._id,'tokens.token':token})
        console.log(repoter)

        if(!reporter){
            console.log('No reporters is found') 
            throw new Error()
        }
        req.reporter = reporter

        
        req.token = token
        next()
    }
    catch(e){
        res.status(400).send({error:'Please authenticate'})
    }

  
}

module.exports = auth