const mongoCollections = require("../config/mongoCollections");
const ObjectID = require('mongodb').ObjectID; //got it from stack overflow. it converts string to mongoDB object
const reservations = mongoCollections.reservations;
const restaurants = mongoCollections.restaurants;
const managers=mongoCollections.managerinfo;
async function createManager(name,restregnum,username,password){
    if(!name){
        throw "Name not given while registering manager";
    }
    if(!restregnum){
        throw "Restaurant Registration Number not given while registering manager";
    }
    if(!username){
        throw "Username is not given while registering manager";
    }
    if(!password){
        throw "Password is not given while registering manager";
    }
    const restCollection=await restaurants();
    const restCheck=await restCollection.findOne({RestaurantRegistrationNumber:restregnum});
    if(!restCheck){
        throw "Restaurant not found for corresponding registration number";
    }
    else{
        const newManager={
            name:name,
            restaurantregistrationnumber:restregnum,
            username:username,
            password:password
        }
        const mancollection=await managers();
        const newOne=await mancollection.insertOne(newManager);
        if (newOne.insertedCount === 0) {
            throw "New manager not added";
        }
        const newId = newOne.insertedId;
        const newlyCreated = await getManager(newId);
        return newlyCreated;
    }

}
async function getManager(id){
    if(!id){
        throw "Manager ID is not given";
    }
    const mancollection=await managers(); 
    const myManager=await mancollection.findOne({_id:ObjectID(id)});
    if(!myManager){
        throw "Manager not found for id"+id;
    }
    else{
        return myManager;
    }
}
async function userNameCheck(username){
    if(!username){
        throw "Username is not given";
    }
    const managCollection=await managers();
    const myManager=await managCollection.findOne({username:username})
    if(!myManager){
        return true;
    }
    return false;
}
async function getMnanager_Username(username){
    if(!username){
        throw "Username is not given";
    }
    const managCollection=await managers();
    const myManager=await managCollection.findOne({username:username});
    if(!myManager){
        throw "Manager not found";
    }
    return myManager;
}
async function manager_UpdatePassword(username,password){
    if(!password){
        throw "password field is empty";
    }
    if(!username){
        throw "username field is empty";
    }
    
    const managCollection=await managers();
    const myManager=await managCollection.findOne({username:username});
    
    let updatedMnanager;
    if(myManager==null){
        throw "Manager not found in database";
    }
    
    else{
        updatedMnanager={};
        updatedMnanager["password"]=password;
        
        const updatedData=await managCollection.updateOne({_id:myManager._id},{$set:updatedMnanager})
        if (updatedData.modifiedCount === 0) {
            throw "Couldn't update restaurant successfully";
        }
        else{
            return await getManager(myManager._id);
        }
            
    }
     
}

async function getReservations(username) {
    if(!username){
        throw "username is not given";
    }
    const managCollection=await managers();
    const myManager=await managCollection.findOne({username:username});
    if(!myManager){
        throw "manager not found";
    }
    const restColl=await restaurants();
    const myRest=await restColl.findOne({RestaurantRegistrationNumber:myManager.restaurantregistrationnumber})
    if(!myRest){
        throw "restaurant not found";
    }
    const reservColl=await reservations();
    const myReserv=await reservColl.find({RestaurantId:myRest._id}).toArray();
    return myReserv;
    
}
async function getReservations_Using_RestaurantId(restaurantId){
    if(!restaurantId){
        throw "restaurant id is absent to pull reservations";
    }
    const reservColl=await reservations();
    const myReserv=await reservColl.find({RestaurantId:restaurantId}).toArray();
    return myReserv;
}
module.exports={getReservations_Using_RestaurantId,createManager,getReservations,manager_UpdatePassword,getMnanager_Username,userNameCheck,getManager}
