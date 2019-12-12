const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const reservation=data.reservations;
const restaurant=data.restaurants;
const manager=data.managers;

async function main(){
    try{
        const db = await dbConnection();
        await db.dropDatabase();

      
        const restaurant1=await restaurant.create_Restaurant("The Cuban","333 Washington St","Hoboken","New Jersey","07030","The Cuban","10.00,11.00,12.00,13.00,14.00,20.00,21.00",30);
        const restaurant2=await restaurant.create_Restaurant("Halifax"," 225 River St","Hoboken","New Jersey","07030","Halifax","12.00,13.00,14.00,20.00,21.00,22.00",30);
        const restaurant3=await restaurant.create_Restaurant("Anthony David's"," 953 Bloomfield St","Hoboken","New Jersey","07030","Anthony David","11.00,12.00,14.00,20.00,21.00",20);
        const restaurant4=await restaurant.create_Restaurant("Zack's","232 Willow Ave","Hoboken","New Jersey","07030","Zack","11.00,12.00,19.00,20.00,21.00",20);
        const restaurant5=await restaurant.create_Restaurant("Union Hall Hoboken","306 Sinatra Dr","Hoboken","New Jersey","07030","Union Hall","10.00,11.00,12.00,13.00,14.00,19.00,20.00,21.00",40);
        const restaurant6=await restaurant.create_Restaurant("THE GRILL","99 E 52nd St","New York","New York","10022","THE GRILL","10.00,11.00,12.00,13.00,14.00,19.00,20.00,21.00",25);
        const restaurant7=await restaurant.create_Restaurant("Upland","345 Park Ave S","New York","New York","10010","Upland","10.00,11.00,12.00,13.00,14.00,19.00,20.00,21.00",30);
        const restaurant8=await restaurant.create_Restaurant("Park Wayne Diner","721 Paterson Hamburg Turnpike","Wayne","New Jersey","07470","Park Wayne Diner","10.00,11.00,12.00,13.00,14.00,19.00,20.00,21.00,22.00,23.00",30);
        const restaurant9=await restaurant.create_Restaurant("Fire & Oak","479 Washington Blvd","Jersey City","New Jersey","07310","Fire & Oak","14.00,19.00,20.00,21.00,22.00,23.00",15);
        const restaurant10=await restaurant.create_Restaurant("Korai Kitchen","576 Summit Ave","Jersey City","New Jersey","07306","Korai Kitchen","19.00,20.00,21.00,22.00,23.00",10);








    console.log('Done seeding database');
    await db.serverConfig.close();

    }
    catch(e){
        throw "Seeding is not successfull;"+e;
    }
}
main();