const express = require("express");
const router = express.Router();

const data = require("../data");
const reservationData = data.reservations;
const restaurantData=data.restaurants;

router.get("/",async(req,res)=>{
    try{
        res.render('cust/homepage');
    }
    catch(e){
        res.status(404).send("Homepage not found");
    }

})
router.post("/search",async(req,res)=>{
    try{
        let searchword=req.body.Restaurantsearch;//Now I have Search result.
        console.log(searchword);
        
        const restaurantList=await restaurantData.get_Restaurants_Name_Or_City(searchword.toLowerCase());
        res.render("cust/searchRestaurant",{searchword:searchword,restaurantList:restaurantList});

    }
    catch(e){
        throw "Couldn't load search page"+e;
    }
})


module.exports=router;