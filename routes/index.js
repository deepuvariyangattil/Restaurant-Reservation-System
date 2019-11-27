const reservationRoutes = require("./reservation");
const restaurantRoutes = require("./restaurant");
const managerRoutes = require("./manager");
const homeRoutes = require("./home");


const constructorMethod = app => {
  app.use("/reservation", reservationRoutes);
  app.use("/restaurant", restaurantRoutes);
  app.use("/manager",managerRoutes);
  app.use("/",homeRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;