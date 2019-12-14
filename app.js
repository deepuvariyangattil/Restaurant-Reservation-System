const express = require('express');
const app = express();
const session = require('express-session')
const static = express.static(__dirname + '/public');
const methodOverride=require('method-override');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Middleware

app.use(session({
    
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))


app.get("/manager/login",function(req,res,next){
  if(req.session.userLoggedIn){
    res.redirect("/manager/home");
  }
  else{
    next();
  }
})


app.get("/manager/home",function(req,res,next){
  if(!req.session.userLoggedIn){
    res.status(403).render('manager/error',{errormessage:"user is not logged in. Please login fIrst"});
}
else{
    next();
}

})
app.get("/manager/editreservation/:id",function(req,res,next){
  if(!req.session.userLoggedIn){
    res.status(403).render('manager/error',{errormessage:"user is not logged in. Please login fIrst"});
}
else{
    next();
}
})
app.get("/manager/createreservation",function(req,res,next){
  if(!req.session.userLoggedIn){
    res.status(403).render('manager/error',{errormessage:"user is not logged in. Please login fIrst"});
}
else{
    next();
}
})
app.get("/manager/confirmreservation",function(req,res,next){
  if(!req.session.userLoggedIn){
    res.status(403).render('manager/error',{errormessage:"user is not logged in. Please login fIrst"});
}
else{
    next();
}

})


configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});