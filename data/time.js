const mongoCollections = require("../config/mongoCollections");
const ObjectID = require('mongodb').ObjectID; //got it from stack overflow. it converts string to mongoDB object
const restaurants = mongoCollections.restaurants;
const timetable=mongoCollections.timetableinfo;

async function createTimetable(timeslots,tableCount,restaurantId){
    if(!timeslots){
        throw "timeslots are empty to create a time table relation";
    }
    if(!restaurantId){
        throw "restaurant Id is missing to add table time relation";
    }
    if(!tableCount){
        throw "Table count is missing to add table time relation";
    }
    let timeArray=timeslots.split(",");
    let timeTableData={
        restaurantId:restaurantId
    }

    timeArray.forEach(time => {
        
        let timeFormat=time.match(/[a-zA-Z]+/);
        
        time=(time.replace(/[a-zA-Z]+/, " "));
        let timeVal=time.trim();
        if(timeFormat[0]=="AM"||(timeFormat[0]=="PM"&&timeVal>12)){
            time=Number(parseFloat(timeVal)).toFixed(2);
        }
        else if(timeFormat[0]=="PM"&&timeVal<12){
            time=Number(parseFloat(timeVal)+12).toFixed(2);
        }

        time=time.toString().replace(".","_");
        timeTableData[time]=tableCount;
        
    });



    const timetableColl=await timetable();
    const myTime=await timetableColl.insertOne(timeTableData);
    if (myTime.insertedCount === 0) {
        throw "New time table relation not added";
    }
    
    const newlyCreated = await get_timeTableData_id(restaurantId);
    return newlyCreated;
}

async function get_timeTableData_id(id){
    if(!id){
        throw "Id is absent to get time table relation";
    }
    const timeTableColl=await timetable();
    const mytableTime=await timeTableColl.findOne({"restaurantId":id});
    
    return mytableTime;
}
async function get_tableCount_id_time(id,time){
    if(!id){
        throw "Id is absent to get time table relation";
    }
    if(!time){
        throw "Time is absent to fetch table count";
    }
    const mytimeTable=await get_timeTableData_id(id);
    if(mytimeTable!=null){
        let timeFormat=time.match(/[a-zA-Z]+/);
        
        time=(time.replace(/[a-zA-Z]+/, " "));
        let timeVal=time.trim();
        if(timeFormat[0]=="AM"||(timeFormat[0]=="PM"&&timeVal>12)){
            time=Number(parseFloat(timeVal)).toFixed(2);
        }
        else if(timeFormat[0]=="PM"&&timeVal<12){
            time=Number(parseFloat(timeVal)+12).toFixed(2);
        }
        time=time.toString().replace(".","_")
        return mytimeTable[time];
    }
    else{
        return null;
    }
}
async function update_tableCount_id_time(id,time,count){
    if(!id){
        throw "Id is absent to get time table relation";
    }
    if(!time){
        throw "Time is absent to fetch table count";
    }
    if(!count){
        throw "Updated table count is empty";
    }
    let timeFormat=time.match(/[a-zA-Z]+/);
        
    time=time.replace(/[a-zA-Z]+/, " ");
       let timeVal=time.trim();
    if(timeFormat[0]=="AM"||(timeFormat[0]=="PM"&&timeVal>12)){
        time=Number(parseFloat(timeVal)).toFixed(2);
    }
    else if(timeFormat[0]=="PM"&&timeVal<12){
        time=Number(parseFloat(timeVal)+12).toFixed(2);
    }
    
    
    time=time.toString().replace(".","_");

    const timeTableColl=await timetable();
    const mytableTime=await get_timeTableData_id(id);
    let updatedObj={};
    updatedObj[time]=count;
    
    const tableUpdate=await timeTableColl.updateOne({"restaurantId":mytableTime.restaurantId},{$set:updatedObj},{ upsert: true });
    if (tableUpdate.modifiedCount === 0) {
        throw "Couldn't update table count successfully";
    }
    return await get_timeTableData_id(mytableTime.restaurantId);


}
async function deleteTableTime(restid){
    if(!restid){
        throw "restaurant ID is absent to delete time table relation";
    }
    const timeTableColl=await timetable();
    await timeTableColl.deleteOne({"restaurantId":restid})
    return 200;

}

//module.exports={get_tableCount_id_time,get_timeTableData_id,createTimetable,update_tableCount_id_time,deleteTableTime}

async function main(){
    try{
        //const myrest=await create_Restaurant("Wayne Hills Diner","1465 Hamburg Turnpike","Wayne","New Jersey","07470","AWE123","9.30-10.30,10.30-11.30,11.30-12.30",25);
        const myrest=await createTimetable("10.30AM,11.30 AM,12.30 PM,1.30PM",25,"5de453daad02342e185deepu")
        console.log(myrest)
        //let myrest=await get_tableCount_id_time("563237a41a4d68582c2509da","10.30")

        // let newcount=myrest-1;
        
        
        // const newcountinDB=await update_tableCount_id_time("563237a41a4d68582c2509da","10.30",newcount);
        // console.log(newcountinDB)

        // let abc=await deleteTableTime("563237a41a4d68582c2509da");
        // console.log(abc);
    }
    catch(e){
        throw "Restaurant Didn't add"+e;
    }
}
main();