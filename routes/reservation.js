const express = require("express");
const router = express.Router();
const shortid = require('shortid');
const xss = require('xss');
const data = require("../data");
const reservationData = data.reservations;
const restaurantData=data.restaurants;
const tableData=data.tablecount;

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

    let reservationNumber=xss(req.body.editReservationNum);
    let reservationEmail=(xss(req.body.editReservationEmail)).toLowerCase();
    let reservationPhone=xss(req.body.editReservationPhone);
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
        let restaurantId=myResv.RestaurantId;
        const reservationTime=await restaurantData.get_Restaurant_Time(restaurantId);
        res.render("cust/editRSVN",{custInput:myResv,timearray:reservationTime})
    }
    
    }
    catch(e){
        throw "Find reservation page can't be found"+e
    }
    

})
router.get("/:id",async(req,res)=>{
    try{
        let restaurantId=xss(req.params.id);
        const reservationTime=await restaurantData.get_Restaurant_Time(restaurantId);
        
        res.status(200).render("cust/newRSVN",{restaurantId:req.params.id,timearray:reservationTime});
    }
    catch(e){
       throw "Couldn't load new resevation page"+e;
    }
})

router.post("/confirmation",async(req,res)=>{
    try{
        let name=(xss(req.body.custName)).toLowerCase();
        let email=(xss(req.body.custEmail)).toLowerCase();
        let phone=xss(req.body.custPhone);
        let noOfPeople=xss(req.body.custNumPeople);
        let time=xss(req.body.custTime);
        let preference=(xss(req.body.custPref)).toLowerCase();
        let reservationNumber=shortid.generate();
        let restaurantId=xss(req.body.restaurantid);
        let updatedCount,existingCount,bookedTable;
        const restaurant=await restaurantData.get_Restaurant_id(restaurantId);
        
        let restaurantName=restaurant.RestaurantName;
        
        const newResv=await reservationData.createReservation(name,email,phone,noOfPeople,restaurantName,restaurantId,null,time,preference,reservationNumber);
        if(newResv=="exists"){
            res.status(200).render("cust/errorRSVN",{errormessage:"Hey You have already reserved a table using same email and phone number. So you can't make new reservation"});
        }
        else if(newResv.ReservationNumber){
            existingCount=await restaurantData.get_TableCount(restaurantId);
            
            if(parseInt(noOfPeople)<=4){
                updatedCount=parseInt(existingCount)-1;
                bookedTable=1;
            }
            else{
                updatedCount=parseInt(existingCount)-2;
                bookedTable=2;
            }
            const updatedCountdb=await restaurantData.update_TableCount(restaurantId,updatedCount);
            
            const updatedTableResev=await tableData.createTableReserved(newResv._id,restaurantId,bookedTable);
            
            if(updatedCountdb!=null && updatedTableResev!=null){
                res.status(200).render("cust/confirmRSVN",{ReservationNumber:newResv.ReservationNumber,transaction:"confirmed"})
            }

            else{
                res.render("cust/errorRSVN",{errormessage:"Hey,Couldn't add new reservation. Please try again"});
            }

        }

        else{
            res.render("cust/errorRSVN",{errormessage:"Hey,Couldn't add new reservation. Please try again"});
        }
    }
    catch(e){
        throw "Couldn't add new reservation"+e;
    }
})



router.put("/confirmation",async(req,res)=>{
    
    
    try{
        
        let noOfPeople=xss(req.body.custNumPeople);
        let reservationTime=xss(req.body.custTime);
        let reservationPreference=(xss(req.body.custPref)).toLowerCase();
        let reservationid=xss(req.body.reservationID);
        let updatedTableCount;
        let updatedTableReserv,tempCount=0;
        let existTabCount,newTabCount;
        const existingReservation=await reservationData.get_ID(reservationid);
        
        let existPeople=existingReservation.NumberOfPeople;
        
        if(parseInt(noOfPeople)>4 && parseInt(existPeople)<=4){
            updatedTableCount=2;
            updatedTableReserv=await tableData.editTableReservation(reservationid,updatedTableCount);
        }
        if(parseInt(noOfPeople)<=4 && parseInt(existPeople)>4){
            updatedTableCount=1;
            updatedTableReserv=await tableData.editTableReservation(reservationid,updatedTableCount);
        }

        existTabCount=await restaurantData.get_TableCount(existingReservation.RestaurantId);
        if(parseInt(noOfPeople)>4 && parseInt(existPeople)<=4 && parseInt(existTabCount)>=1){
            newTabCount=parseInt(existTabCount)-1;
            
        }
        else if(parseInt(noOfPeople)<=4 && parseInt(existPeople)>4){
            newTabCount=parseInt(existTabCount)+1;
        }
        else if(parseInt(noOfPeople)>4 && parseInt(existPeople)<=4 && parseInt(existTabCount)<2){
            tempCount=1;
            res.status(200).render("cust/errorRSVN",{errormessage:"Couldn't update your Reservation due to table unavailability"});
        }
        else{
            newTabCount=parseInt(existTabCount);
        }
        if(tempCount==0){
            const updatedReservation=await reservationData.update_Reservation(reservationid,reservationPreference,noOfPeople,reservationTime);
            const update_TableCount_DB=await restaurantData.update_TableCount(existingReservation.RestaurantId,newTabCount);
            if(updatedReservation==null || update_TableCount_DB==null){
                res.status(200).render("cust/errorRSVN",{errormessage:"Couldn't update your Reservation"});
            }
            else{
                res.status(200).render("cust/confirmRSVN",{ReservationNumber:updatedReservation.ReservationNumber,transaction:"updated"})
            }
    
        }

       
    }
    catch(e){
        throw "Couldn't load Edit Reservation Page"+e;
    }
})

router.delete("/confirmation",async(req,res)=>{
    try{
        let reservationid=xss(req.body.reservationID);
        let tableCount,restaurantTableNow,updatedTableCount;
        const table_Reserv_Info=await tableData.getTableReservation(reservationid);
        tableCount=table_Reserv_Info.TableBooked;
        const myReserv=await reservationData.get_ID(reservationid);
        restaurantTableNow=await restaurantData.get_TableCount(myReserv.RestaurantId);
        updatedTableCount=parseInt(tableCount)+parseInt(restaurantTableNow);
        const deletedReservation=await reservationData.delete_Id(reservationid);

        if(deletedReservation){

            const update_table_DB=await restaurantData.update_TableCount(myReserv.RestaurantId,updatedTableCount);
            const delete_Table_Reserv=await tableData.deleteTableReservation(reservationid);


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