const express = require("express");
const router = express.Router();

const data = require("../data");

router.get("/",async(req,res)=>{
    try{
        res.render('homepage');
    }
    catch(e){
        res.status(404).send("Homepage not found");
    }

})

module.exports=router;