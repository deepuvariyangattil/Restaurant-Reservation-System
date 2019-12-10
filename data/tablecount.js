const mongoCollections = require("../config/mongoCollections");
const ObjectID = require('mongodb').ObjectID; //got it from stack overflow. it converts string to mongoDB object
const reservation = mongoCollections.reservations;
const tablecount=mongoCollections.tablecountinfo;

async function createTableReserved(reservationId,RestaurantId,noOfTable){
    if(!reservationId){
        throw "reservation id is absent to create table count collection"; 
    }
    if(!RestaurantId){
        throw "Restaurant id is absent to create table count collection";
    }
    if(!noOfTable){
        throw "No of table booked is absent to create table count collection";
    }
    
    const newTableReserved={
        ReservationID:ObjectID(reservationId),
        RestaurantID:ObjectID(RestaurantId),
        TableBooked:noOfTable
    }
    const tableColl=await tablecount();
    const newTableRes=await tableColl.insertOne(newTableReserved);
    if (newTableRes.insertedCount === 0) {
        throw "New reservation not added";
    }
    
    return 200;
}
async function editTableReservation(reservationId,noOfTable){
    if(!reservationId){
        throw "reservation id is absent to create table count collection"; 
    }
    if(!noOfTable){
        throw "No of table booked is absent to create table count collection";
    }
    let updatedTable={};
    updatedTable["TableBooked"]=noOfTable;
    const tableColl=await tablecount();
    const updatedTableResv=await tableColl.updateOne({ReservationID:ObjectID(reservationId)},{$set:updatedTable},{upsert:true});
    if(updatedTableResv.modifiedCount==0){
        throw "Table reservation not updated";
    }
    return 200;
}
async function getTableReservation(reservationId){
    if(!reservationId){
        throw "reservation id is absent to create table count collection"; 
    }
    const tableColl=await tablecount();
    const myTableReserv=await tableColl.findOne({ReservationID:ObjectID(reservationId)});
    return myTableReserv;
}
async function deleteTableReservation(reservationId){
    if(!reservationId){
        throw "reservation id is absent to create table count collection"; 
    }
    const tableColl=await tablecount();
    await tableColl.deleteOne({ReservationID:ObjectID(reservationId)});
    return 200; 
}


module.exports={createTableReserved,editTableReservation,getTableReservation,deleteTableReservation}