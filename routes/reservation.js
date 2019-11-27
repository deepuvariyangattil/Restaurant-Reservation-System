const express = require("express");
const router = express.Router();
const shortid = require('shortid');

const data = require("../data");
const reservationData = data.reservations;
const restaurantData=data.restaurants;

router.get("/search-result",async(req,res)=>{
    try{
        let name=req.body.searchname;
        const restaurants=await restaurantData.get_Restaurants_Name_Or_City(name);
        res.render('/search-result',{restaurants:restaurants});
    }
    catch(e){
        res.status(404).send("Couldn't find restaurant"+e)

    }
})
router.post("/reservation/search/:id",async(req,res)=>{
    try{
        let name=(req.body.custName).toLower();
        let email=(req.body.custEmail).toLower();
        let phone=req.body.custPhone;
        let noOfPeople=req.body.custNumPeople;
        let time=req.body.custTime;
        let preference=(req.body.custPref).toLower();
        let reservationNumber=shortid.generate();
        let restaurantId=req.params.id;
        const restaurant=await restaurantData.get_Restaurant_id(restaurantId);
        let restaurantName=restaurant.RestaurantName;

        const newResv=await reservationData.createReservation(name,email,phone,noOfPeople,restaurantId,restaurantName,null,time,preference,reservationNumber);
        if(newResv){
            res.status(200).render("/cust/confirmRSVN",{ReservationNumber:newResv.ReservationNumber})

        }
        else{
            res.status(400).send("Couldn't add reservation");
        }
    }
    catch(e){
        throw "Couldn't add new reservation"+e;
    }
})
req.get("/reservation/search/:id",async(req,res)=>{
    try{
        res.status(200).render("/cust/newRSVN");
    }
    catch(e){
       throw "Couldn't load new resevation page"+e;
    }
})
req.get("/reservation/find",async(req,res)=>{
    try{
        res.send(200).render("/cust/findRSVN");
    }
    catch(e){
        throw "Find reservation page can't be displayed"+e;
    }
})
req.post("/reservation/find",async(req,res)=>{
    
    let reservationId,email,phone;
    let option;
    try{
        
        if(req.body.custRSVNRef){
            reservationId=req.body.custRSVNRef;
            option=1;
        }
        else{
            if(!req.body.custEmail){
                throw "Customer email is empty";
            }
            else{
                email=req.body.custEmail;
            }
            if(!req.body.custPhone){
                throw "Customer phone is empty";
            }
            else{
                phone=req.body.custPhone;
                option=2;
            }
        }

        if(option==1){
            const myResv=await reservationData.get_ID(reservationId);
        }
        if(option==2){
            const myResv=await reservationData.get_Email_Phone(email,phone);
        }

    }
})








module.exports=router;