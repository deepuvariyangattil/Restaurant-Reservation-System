const express = require("express");
const router = express.Router();
const shortid = require('shortid');

const data = require("../data");
const reservationData = data.reservations;
const restaurantData=data.restaurants;

router.get("/find",async(req,res)=>{
    try{
        res.status(200).render("cust/findRSVN");
    }
    catch(e){
        throw "Find reservation page can't be displayed"+e;
    }
})
router.post("/results",async(req,res)=>{
    try{

    let reservationNumber=req.body.editreservationnumber;
    let reservationEmail=(req.body.editreservationemail).toLowerCase();
    let reservationPhone=req.body.editreservationphone;
    let myResv;
    if(reservationNumber){
        myResv=await reservationData.get_Reservation_ID(reservationNumber);
        
    }
    else{
        if(!reservationEmail){
            throw "Email is absent to search a reservation";
        }
        if(!reservationPhone){
            throw "Phone is absent to search a reservation";
        }
        myResv=await  reservationData.get_Email_Phone(reservationEmail,reservationPhone);
    }
    if(myResv==null){
        res.render("cust/errorRSVN",{errormessage:"Invalid Reservation credentials. Please try again with valid credentials"})

    }
    else{
        res.render("cust/editRSVN",{custInput:myResv})
    }
    
    }
    catch(e){
        throw "Find reservation page can't be found"+e
    }
    

})
router.get("/:id",async(req,res)=>{
    try{
        res.status(200).render("cust/newRSVN",{restaurantId:req.params.id});
    }
    catch(e){
       throw "Couldn't load new resevation page"+e;
    }
})

router.post("/confirmation",async(req,res)=>{
    try{
        let name=(req.body.custName).toLowerCase();
        let email=(req.body.custEmail).toLowerCase();
        let phone=req.body.custPhone;
        let noOfPeople=req.body.custNumPeople;
        let time=req.body.custTime;
        let preference=(req.body.custPref).toLowerCase();
        let reservationNumber=shortid.generate();
        let restaurantId=req.body.restaurantid;
        
        const restaurant=await restaurantData.get_Restaurant_id(restaurantId);
        
        let restaurantName=restaurant.RestaurantName;
        
        const newResv=await reservationData.createReservation(name,email,phone,noOfPeople,restaurantName,restaurantId,null,time,preference,reservationNumber);
        if(newResv=="exists"){
            res.status(200).render("cust/errorRSVN",{errormessage:"Hey You have already reserved a table using same email and phone number. So you can't make new reservation"});
        }
        else if(newResv.ReservationNumber){
            res.status(200).render("cust/confirmRSVN",{ReservationNumber:newResv.ReservationNumber,transaction:"confirmed"})

        }

        else{
            res.status(400).send("Couldn't add reservation");
        }
    }
    catch(e){
        throw "Couldn't add new reservation"+e;
    }
})



router.put("/confirmation",async(req,res)=>{
    
    
    try{
        
        let noOfPeople=req.body.custNumPeople;
        let reservationTime=req.body.custTime;
        let reservationPreference=(req.body.custPref).toLowerCase();
        let reservationid=req.body.reservationID

        

        const updatedReservation=await reservationData.update_Reservation(reservationid,reservationPreference,noOfPeople,reservationTime);
        
        
        if(updatedReservation==null){
            res.status(200).render("cust/errorRSVN",{errormessage:"Couldn't update your Reservation"});
        }
        else{
            res.status(200).render("cust/confirmRSVN",{ReservationNumber:updatedReservation.ReservationNumber,transaction:"updated"})
        }

        
       
    }
    catch(e){
        throw "Couldn't load Edit Reservation Page"+e;
    }
})

router.delete("/confirmation",async(req,res)=>{
    try{
        let reservationid=req.body.reservationID

        const deletedReservation=await reservationData.delete_Id(reservationid);

        if(deletedReservation){
            res.render("cust/confirmRSVN",{ReservationNumber:"no longer valid",transaction:"deleted"})
         }
        else{
            res.render("cust/errorRSVN",{errormessage:"Couldn't delete your Reservation"})
        }
    }
    catch(e){
        throw "Couldn't delete reservation"+e;
    }


    

})








module.exports=router;