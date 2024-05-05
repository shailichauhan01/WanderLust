if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}

console.log(process.env.SECRET) ;

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local").Strategy;
const User=require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");

const app = express();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("Connected to Db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true})); //Used For Parsing
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

const sessionOptions ={
  secret:"mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires: Date.now() +1000*60*60*24*3,
    maxAge: 1000*60*60*24*3,
    httpOnly:true,
  }
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am Root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});

app.get("/demouser",async (req,res) =>{
  let fakeUser = new  User({
    email:"student@gmail.com",
    username:"student"
  });

  let registeredUser= await User.register(fakeUser,"Hii");
  res.send(registeredUser);
})

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
});
//MiddleWare For Custom Error Handler
app.use((err,req,res,next)=>{
  let {status=500,message="Something went Wrong!"}= err;
  res.status(status).render("error.ejs",{message});
  // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening on Port 8080");
});
