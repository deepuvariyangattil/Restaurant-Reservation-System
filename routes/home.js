const express = require("express");
const router = express.Router();
const xss = require('xss');
const data = require("../data");
const reservationData = data.reservations;
const restaurantData=data.restaurants;

router.get("/",async(req,res)=>{
    try{
        res.status(200).render('cust/homepage');
    }
    catch(e){
        res.status(404).send("Homepage not found");
    }

})
router.get("/business",async(req,res)=>{
    try{
        res.render("sysAdmin/business");
    }
    catch(e){
        throw "Business page is not loaded"+e;
    }
})
router.post("/search",async(req,res)=>{
    try{
        let searchword=(xss(req.body.Restaurantsearch)).trim();//Now I have Search result.
        
        let regex = new RegExp([".*", searchword.toLowerCase(), ".*"].join(""), "i");
        
        const restaurantList=await restaurantData.get_Restaurants_Name_Or_City(regex);
        res.status(200).render("cust/searchRestaurant",{searchword:searchword,restaurantList:restaurantList});

    }
    catch(e){
        throw "Couldn't load search page"+e;
    }
})


module.exports=router;