const express = require("express");
const router = express.Router();
const data = require("../data");
const bcrypt = require("bcryptjs");
const shortid = require('shortid');
const xss = require('xss');
const reservationData = data.reservations;
const restaurantData=data.restaurants;
const managerData=data.managers;
const tableData=data.tablecount;

router.get("/register", async(req,res)=>{
    try{
        res.render("manager/registration");
    }
    catch(e){
        throw "Couldn't register new manager"+e;
    }
})

router.post("/confirmation",async(req,res)=>{
    try{
        let name=(xss(req.body.managername)).toLowerCase();
        let restaurantRegNumber=xss(req.body.restaurantregnumber);
        let username=(xss(req.body.username)).toLowerCase();
        let password=await bcrypt.hash((xss(req.body.password)),16);

        const myManager=await managerData.createManager(name,restaurantRegNumber,username,password);

        if(myManager!=null){
            res.status(200).render("manager/confirmation",{action:"Created"})
        }
        else{
            res.render("manager/error",{errormessage:"Manager Account is not created!!!!"})
        }


    }
    catch(e){
        throw "New mananger is not added"+e;

    }
})

router.get("/login",async(req,res)=>{
    try{
        res.render("manager/login");
    }
    catch(e){
        throw "Couldn't load manager login page";
    }
})
router.post("/home",async(req,res)=>{
    try{
        
        let username=(xss(req.body.usernamelogin)).toLowerCase();
        let password=xss(req.body.passwordlogin);

        const myManager=await managerData.getMnanager_Username(username);
        
        if(myManager!=null){
            if(await bcrypt.compare(password,myManager.password)){
                const myResvData=await managerData.getReservations(username);
                let restaurantId,anyReservation;
                anyReservation=myResvData[0];
                restaurantId=anyReservation.RestaurantId;
                req.session.userLoggedIn=username;
                req.session.restaurantId=restaurantId;
                res.render("manager/home",{reservations:myResvData,restaurantId:restaurantId})
            }
            else{
                res.status(200).render("manager/error",{errormessage:"Your username or password is wrong. Please try again with correct credentials"});
            }
        }
        else{
            res.render("manager/error",{errormessage:"Your username or password is wrong. Please try again with correct credentials"});
        }
    }
    catch(e){
        throw "Couldn't perform manager login"+e;
    }
})

router.get("/home",async(req,res)=>{
    try{
        let restaurantId=req.session.restaurantId;
        let username=req.session.userLoggedIn;
        
        const myReservations=await managerData.getReservations(username);
        
        
        res.render("manager/home",{reservations:myReservations,restaurantId:restaurantId})
    }
    catch(e){
        throw "Couldn't load manager home page"+e;
    }
})


router.get("/editreservation/:id",async(req,res)=>{
    try{
        let reservationId=xss(req.params.id);
        const myResv=await reservationData.get_ID(reservationId);
        let restaurantId=req.session.restaurantId;
        const reservationTime=await restaurantData.get_Restaurant_Time(restaurantId);

        res.render("manager/editreservation",{custInput:myResv,timearray:reservationTime})
    }
    catch(e){
        throw "Couldn't load edit reservation page"+e;
    }
})
router.get("/createreservation",async(req,res)=>{
    try{
        let restaurantId=req.session.restaurantId; 
        const reservationTime=await restaurantData.get_Restaurant_Time(restaurantId);
        res.render("manager/createreservation",{restaurantId:restaurantId,timearray:reservationTime});
    }
    catch(e){

        throw "Couldn't load create reservation from manager"+e;

    }
})
router.put("/home",async(req,res)=>{
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
            res.status(200).render("manager/error",{errormessage:"Couldn't update your Reservation due to table unavailability"});
        }
        else{
            newTabCount=parseInt(existTabCount);
        }
        if(tempCount==0){
            const updatedReservation=await reservationData.update_Reservation(reservationid,reservationPreference,noOfPeople,reservationTime);
            
            const update_TableCount_DB=await restaurantData.update_TableCount(existingReservation.RestaurantId,newTabCount);
            if(updatedReservation==null || update_TableCount_DB==null){
                res.status(200).render("manager/error",{errormessage:"Couldn't update your Reservation"});
            }
            else{
                const myResvData=await managerData.getReservations_Using_RestaurantId(existingReservation.RestaurantId);
                res.render("manager/home",{reservations:myResvData,restaurantId:existingReservation.RestaurantId})
            }
    
        }

       
    }
    catch(e){
        throw "Couldn't update reservation"+e;
    }
})
router.get("/forgot",async(req,res)=>{
    try{
        res.status(200).render("manager/forgotpassword")
    }
    catch(e){
        throw "Couldn't load forgot password page"+e;
    }
})
router.post("/login",async(req,res)=>{
    try{
        let username=(xss(req.body.forgotusername)).toLowerCase();
        let restaurantRegNumber=xss(req.body.forgotrestregnum);
        let password=await bcrypt.hash(xss(req.body.forgotpassword),16);

        const myManager=await managerData.getMnanager_Username(username);
        
        if(myManager!=null && restaurantRegNumber==myManager.restaurantregistrationnumber){
            const updateManager=await managerData.manager_UpdatePassword(username,password);
            if(updateManager!=null){
                res.status(200).render("manager/login");
            }
            else{
                res.render("manager/error",{errormessage:"Couldn't update password successfully. Please try again."});
            }
        }
        else{
            res.render("manager/error",{errormessage:"Credentials are not valid. Please try again with valid credentials."})
        }
    }
    catch(e){

    }
})

router.delete("/home",async(req,res)=>{
    try{
        let reservationid=xss(req.body.deletereserbutton);
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
            const myResvData=await managerData.getReservations_Using_RestaurantId(myReserv.RestaurantId);
            res.render("manager/home",{reservations:myResvData,restaurantId:myReserv.RestaurantId})
    
    
            
         }
        else{
            res.status(200).render("manager/error",{errormessage:"Couldn't delete your Reservation"});
        }
    }
    

catch(e){
    throw "Couldn't delete reservation from manager"+e;
}
})

router.post("/confirmreservation",async(req,res)=>{
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
        let username=req.session.userLoggedIn;
        
        const myManager=await managerData.getMnanager_Username(username);
        let creatorId=myManager._id;
        const newResv=await reservationData.createReservation(name,email,phone,noOfPeople,restaurantName,restaurantId,creatorId,time,preference,reservationNumber);
        if(newResv=="exists"){
            res.status(200).render("manager/error",{errormessage:"Hey Your customer has already reserved a table using same email and phone number. So please make a new reservation with different email/phone combination"});
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
                res.status(200).render("manager/confirmreservation",{message:"reservation created successfully"})
            }

            else{
                res.render("manager/error",{errormessage:"Hey,Couldn't add new reservation. Please try again"});
            }

        }

        else{
            res.render("manager/error",{errormessage:"Hey,Couldn't add new reservation. Please try again"});
        }
    }
    catch(e){
        throw "Couldn't add new reservation from Manager"+e;
    }

})
router.get('/logout',async(req,res)=>{
    
    //Credit goes to stack overflow
    req.session.destroy(async ()=>{
        try{
            if(!req.session){
                res.redirect('/');
            }
            
        }
        catch(e){
            throw "Session deletion is unsuccessful"+e;
        }    
        
     });
})

router.get("/usernamecheck?",async(req,res)=>{
    try{
        username=(req.query.username).toLowerCase();
        const myManager=await managerData.getMnanager_Username(username);
        if(myManager==null||myManager==undefined){
            res.json({title:"User name doesnot exist. congrats!!!"})
        }
        else{
            res.json({title:"User name exist. Try again with different names!!!"})
        }

    }
    catch(e){
        throw "Couldn't find username for AJAX"+e;
    }
})




module.exports = router;