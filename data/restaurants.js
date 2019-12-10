const mongoCollections = require("../config/mongoCollections");
const ObjectID = require('mongodb').ObjectID; //got it from stack overflow. it converts string to mongoDB object
const restaurants = mongoCollections.restaurants;

async function get_Restaurants_Name_Or_City(name){

    if(!name){
        throw "Restaurant name or is empty";
    }
    const restCollection=await restaurants();
    const myRest=await restCollection.find({$or:[{RestaurantName:name},{RestaurantCity:name}]}).toArray();
    return myRest;

}
async function get_Restaurant_id(id){
    if(!id){
        throw "Restaurant ID is empty";
    }
    const restCollection=await restaurants();
    const myRest=await restCollection.findOne({_id:ObjectID(id)});
    return myRest;
}
async function create_Restaurant(name,address,city,state,zipcode,registration,timeslots,tablecount){
    if(!name){
        throw "Restaurant name is empty";
    }
    if(!address){
        throw "Restaurant address is empty";
    }
    if(!city){
        throw "Restaurant city is empty";

    }
    if(!state){
        throw "Restaurant state is empty";
    }
    if(!zipcode){
        throw "Restaurant zipcode is empty";
    }
    if(!registration){
        throw "Restaurant Registration number is empty";
    }
    if(!timeslots){
        throw "Restaurant Timeslots are empty";
    }
    if(!tablecount){
        throw "Restaurant Table count is empty"
    }
    //convert time slot string to array
    //let timeSlotArr = timeslots.trim().split(",");

    const restCollection=await restaurants();
    const myRest={
        RestaurantName:name.toLowerCase(),
        RestaurantAddress:address.toLowerCase(),
        RestaurantCity:city.toLowerCase(),
        RestaurantState:state.toLowerCase(),
        RestaurantZip:zipcode,
        RestaurantRegistrationNumber:registration,
        TimeSlots:timeslots,
        TableCount:tablecount
    }
    const newRest=await restCollection.insertOne(myRest);
    if (newRest.insertedCount === 0) {
        throw "New reservation not added";
    }
    const newId = newRest.insertedId;
    const newlyCreated = await get_Restaurant_id(newId);
    return newlyCreated;
}
async function get_Restaurant_RegistartionNum(registration){
    if(!registration){
        throw "Restaurant Registration Number is empty";
    }
    const restCollection=await restaurants();
    const myRest=await restCollection.findOne({RestaurantRegistrationNumber:registration});
    return myRest;
}
async function updateRestaurant_TimeSlot_TableCount(registration,timeslot,tablecount){
    let newTimeSlot,newTableCount;
    if(!registration){
        throw "Restaurant registartion number is empty";
    }
    const restCollection=await restaurants();
    const myRest=await restCollection.findOne({RestaurantRegistrationNumber:registration})
    if(!timeslot){
        newTimeSlot=myRest.TimeSlots;
    }
    else{
        newTimeSlot=timeslot;
    }
    if(!tablecount){
        newTableCount=myRest.TableCount;
    }
    else{
        newTableCount=tablecount;
    }
    const updateRest={
        RestaurantName:myRest.RestaurantName,
        RestaurantAddress:myRest.RestaurantAddress,
        RestaurantCity:myRest.RestaurantCity,
        RestaurantState:myRest.RestaurantState,
        RestaurantZip:myRest.RestaurantZip,
        RestaurantRegistrationNumber:myRest.RestaurantRegistrationNumber,
        TimeSlots:newTimeSlot,
        TableCount:newTableCount
    }
    const updatedRest=await restCollection.updateOne({RestaurantRegistrationNumber:registration},{$set:updateRest},{ upsert: true });
    if (updatedRest.modifiedCount === 0) {
        throw "Couldn't update restaurant successfully";
    }
    return await get_Restaurant_id(myRest._id);

}
async function delete_Restaurant(id){
    if(!id){
        throw "Restaurant Id is empty to delete";
    }
    const restCollection=await restaurants();
    await restCollection.removeOne({_id:ObjectID(id)});
    return 200;
}
async function update_TableCount(id,newCount){
    if(!id){
        throw "Restaurant Id is empty to update the table count";
    }
    if(!newCount){
        throw "Table count is empty to update";
    }
    const restCollection=await restaurants();
    const updatedRest={};
    updatedRest["TableCount"]=newCount;
    const updatedData=await restCollection.updateOne({_id:ObjectID(id)},{$set:updatedRest},{upsert:true});
    
    return await get_Restaurant_id(id);
}
async function get_TableCount(id){
    if(!id){
        throw "Restaurant Id is empty to get the table count";
    }
    const restCollection=await restaurants();
    const myRest=await restCollection.findOne({_id:ObjectID(id)});
    return myRest.TableCount;
}
async function get_Restaurant_Time(restaurantId){
    if(!restaurantId){
        throw "Restaurant Id is absent";
    }
    const restCollection=await restaurants();
    const myRest=await restCollection.findOne({_id:ObjectID(restaurantId)});
    let timeslots=myRest.TimeSlots;
    let timeArray=timeslots.split(",");
    return timeArray;
}





module.exports={get_Restaurant_Time,get_TableCount,update_TableCount,get_Restaurant_id,get_Restaurant_RegistartionNum,get_Restaurants_Name_Or_City,create_Restaurant,updateRestaurant_TimeSlot_TableCount,delete_Restaurant}


// async function main(){
//     try{
//         //const myrest=await create_Restaurant("Wayne Hills Diner","1465 Hamburg Turnpike","Wayne","New Jersey","07470","AWE123","9.30-10.30,10.30-11.30,11.30-12.30",25);
//         const myrest=await get_Restaurants_Name_Or_City("hoboken");
//         console.log(myrest);
//     }
//     catch(e){
//         throw "Restaurant Didn't add"+e;
//     }
// }
// main();