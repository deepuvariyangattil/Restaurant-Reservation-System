const reservationData = require("./reservations");
const restaurantData = require("./restaurants");
const managerData = require("./managerinfo");
const tableData = require("./tablecount");


module.exports = {
  reservations: reservationData,
  restaurants: restaurantData,
  managers: managerData,
  tablecount:tableData,
  
};
