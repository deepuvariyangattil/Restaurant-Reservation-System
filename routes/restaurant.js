const express = require("express");
const router = express.Router();
const data = require("../data");
const reservationData = data.reservations;
const restaurantData=data.restaurants;

router.get("/create",async(req,res)=>{
    res.render("restaurant/RestaurantRegistration");
})

router.post("/confirmation", async(req,res)=>{

    try{
        let restName=(req.body.restaurantName).toLowerCase();
        let restAddress=(req.body.restaurantAddress).toLowerCase();
        let restCity=(req.body.restaurantCity).toLowerCase();
        let restState=(req.body.restaurantState).toLowerCase();
        let restRegNum=(req.body.restaurantRegNum).trim();
        let restTimeSlot=req.body.restaurantTime;
        let restTabCount=req.body.restaurantTabNum;
        let restZip=req.body.restaurantZip;

        const existingRest=await restaurantData.get_Restaurant_RegistartionNum(restRegNum);
        if(existingRest){
            res.render("restaurant/error",{errormessage:"Restaurant already registered. Please check your Registration number or contact administrator."})
        }
        else{
            const myRestaurant=await restaurantData.create_Restaurant(restName,restAddress,restCity,restState,restZip,restRegNum,restTimeSlot,restTabCount);
            if(!myRestaurant){
                res.render("restaurant/error",{errormessage:"New Restaurant is not added. Please contact administrator."});
            }
            else{
                res.render("restaurant/confirmRestaurant",{action:"Registered"});
        }
        }
        


    }
    catch(e){
        throw "Couldn't add new restaurant"+e;
    }
})

router.get("/find",async(req,res)=>{
    try{
        res.render("restaurant/findRestaurant");
    }
    catch(e){
        throw " Couldn't load find restaurant page"+e;
    }
})
router.post("/edit",async(req,res)=>{
    try{
        let restaurantRegNum=(req.body.findRestaurant).trim();

        const myRestaurant=await restaurantData.get_Restaurant_RegistartionNum(restaurantRegNum);
        if(myRestaurant!=null){
            res.status(200).render("restaurant/editRestaurant",{restaurantInfo:myRestaurant})
        }
        else{
            res.render("restaurant/error",{errormessage:"Couldn't find any restaurant with given registration number. Please check your Registration Number"})

        }

    }
    catch(e){
        throw "Couldn't load Edit Restaurant Page"+e;
    }

})
router.put("/confirmation",async(req,res)=>{
    try{
        let restaurantTime=req.body.restaurantTime;
        let restaurantTable=req.body.restaurantTabNum;
        let restaurantRegNum=req.body.restaurantRegNum;
        const myRestaurant=await restaurantData.updateRestaurant_TimeSlot_TableCount(restaurantRegNum,restaurantTime,restaurantTable);
        if(myRestaurant!=null){
            res.render("restaurant/confirmRestaurant",{action:"Updated"});
        }
        else{
            res.render("restaurant/errorRestaurant",{errormessage:"Restaurant Update failed. Please try again."});
        }
    }
    catch(e){
        throw "Couldn't update restaurant"+e
    }
})










module.exports = router;