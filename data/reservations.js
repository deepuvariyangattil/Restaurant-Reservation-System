const mongoCollections = require("../config/mongoCollections");
const ObjectID = require('mongodb').ObjectID; //got it from stack overflow. it converts string to mongoDB object
const reservations = mongoCollections.reservations;
const tablecount=mongoCollections.tablecountinfo;

async function getAll(){
    if (arguments.length >= 1) {
        throw "getAll function doesn't require any arguments";
    }
    const reserCollection=await reservations();
    const reservFullList = await reserCollection.find({}).toArray();
    return reservFullList;
}
async function get_ID(id){
    if(!id){
        throw "Reservation ID is not present"
    }
    const myID=ObjectID(id);
    const reserCollection=await reservations();
    const myResv=await reserCollection.findOne({_id:myID});
    return myResv;
}
async function get_Reservation_ID(ReserveID){
    if(!ReserveID){
        throw "Reservation Id is absent";
    }
    const reserCollection=await reservations();
    const myResvation=await reserCollection.findOne({ReservationNumber:ReserveID});
    
    return myResvation;
}
async function get_Email_Phone(email,phone){
    if(!email){
        throw "Email not given for getting reservation";
    }
    if(!phone){
        throw "Email not given for getting reservation";
    }
    const reserCollection=await reservations();
   
    
    const myResv=await reserCollection.findOne({$and:[{CustomerEmail:email},{CustomerPhone:phone}]});
    
    // if(myResv.CustomerName==null){
    //     return true;
    // }
    // else{
    //     return false;
    // }
    //console.log(myResv._id)
    return myResv;
}
async function createReservation(name,email,phone,peopleCount,restaurantName,restaurantID,creatorID,reservationTime,preference,reservationNumber){
    let myCreaterID=null;
    if(!name){
        throw "Customer name is absent";
    }
    if(!email){
        throw "Customer email is absent";
    }
    if(!phone){
        throw "Phone number is absent";
    }
    if(!restaurantID){
        throw "restaurant ID is invalid";
    }
    if(!peopleCount){
        throw "people count is absent";
    }
    if(!reservationTime){
        throw "Reservation time is absent";
    }
    if(!restaurantName){
        throw "Restaurant name is absent";
    }
    if(creatorID){
        myCreaterID=ObjectID(creatorID);
    }
    if(!reservationNumber){
        throw "Reservation number is empty";
    }
   
    const newReservation={
        CustomerName:name,
        CustomerEmail:email,
        CustomerPhone:phone,
        NumberOfPeople:peopleCount,
        RestaurantName:restaurantName,
        RestaurantId:ObjectID(restaurantID),
        CreatorId:myCreaterID,
        ReservationTime:reservationTime,
        CustomerPreference:preference,
        ReservationNumber:reservationNumber
    }
    const reserCollection=await reservations();
    const myCheck=await get_Email_Phone(email,phone);
    
    if(myCheck!=null){
        return "exists";
    }
    else{
        const myResv=await reserCollection.insertOne(newReservation);
        if (myResv.insertedCount === 0) {
            throw "New reservation not added";
        }
        const newId = myResv.insertedId;
        
        const newReserv = await get_ID(newId);
        return newReserv;
    }
    
}
async function update_Reservation(id,preference,numberOfPeople,reservationTime){
    if(!preference){
        throw "Customer Preference is absent";
    }
    if(!id){
        throw "Reservation ID not present";
    }
    
    
    const reserCollection=await reservations();
    let myID=ObjectID(id);
    const myResv=await get_ID(myID);
    
    let newResvTime,newNumberPeople;
    if(!numberOfPeople){
        newNumberPeople=myResv.NumberOfPeople;
    }
    else{
        newNumberPeople=numberOfPeople;
    }
    if(!reservationTime){
        newResvTime=myResv.ReservationTime;
    }
    else{
        newResvTime=reservationTime;
    }


    const updatedReservation={
        CustomerName:myResv.CustomerName,
        CustomerEmail:myResv.CustomerEmail,
        CustomerPhone:myResv.CustomerPhone,
        NumberOfPeople:newNumberPeople,
        RestaurantName:myResv.RestaurantName,
        RestaurantId:myResv.RestaurantId,
        CreatorId:myResv.CreatorId,
        ReservationTime:newResvTime,
        CustomerPreference:preference,
        ReservationNumber:myResv.ReservationNumber
    }
    const updatedResv=await reserCollection.updateOne({_id:myID},{$set:updatedReservation},{ upsert: true });
    if (updatedResv.modifiedCount === 0) {
        throw "Couldn't update reservation successfully";
    }
    return await get_ID(myID);


}



async function update_Email_Phone(email,phone,numberOfPeople,reservationTime){
    if(!email){
        throw "Reservation email is absent";
    }
    if(!phone){
        throw "Reservation Phone number is absent";
    }

    
    const reserCollection=await reservations();
    
    const myResv=await reserCollection.find({$and:[{CustomerEmail:email},{CustomerPhone:phone}]});
    let newResvTime,newNumberPeople;
    if(!numberOfPeople){
        newNumberPeople=myResv.NumberOfPeople;
    }
    else{
        newNumberPeople=numberOfPeople;
    }
    if(!reservationTime){
        newResvTime=myResv.ReservationTime;
    }
    else{
        newResvTime=reservationTime;
    }
    const updatedReservation={
        CustomerName:myResv.CustomerName,
        CustomerEmail:myResv.CustomerEmail,
        CustomerPhone:myResv.CustomerPhone,
        NumberOfPeople:newNumberPeople,
        RestaurantName:myResv.RestaurantName,
        RestaurantId:myResv.RestaurantId,
        CreatorId:myResv.CreatorId,
        ReservationTime:newResvTime,
        CustomerPreference:myResv.CustomerPreference,
        ReservationNumber:myResv.ReservationNumber
    }
    const updatedResv=await reserCollection.updateOne({$and:[{CustomerEmail:email},{CustomerPhone:phone}]},{$set:updatedReservation},{ upsert: true });
    if (updatedResv.modifiedCount === 0) {
        throw "Couldn't update reservation successfully";
    }
    return await get_ID(myResv._id);


}

async function delete_Id(id){
    if(!id){
        throw "Reservation ID is absent to delete";
    }
    const reserCollection=await reservations();
    await reserCollection.removeOne({_id:ObjectID(id)})
    return 200;
}
async function delete_Email_Phone(email,phone){
    if(!email){
        throw "Reservation email is absent to delete";
    }
    if(!phone){
        throw "Reservation phone is absent to delete";
    }
    const reserCollection=await reservations();
    await reserCollection.removeOne({$and:[{CustomerEmail:email},{CustomerPhone:phone}]})
    return 200;
}

module.exports={get_Reservation_ID,getAll,get_ID,get_Email_Phone,createReservation,update_Reservation,update_Email_Phone,delete_Id,delete_Email_Phone}