if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

console.log
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const method_override = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Listingrouter = require("./routes/listing.js");
const Reviewrouter = require("./routes/review.js");
const Userrouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(method_override("_method"));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsMate);
app.use(express.json());



// Establishing Connection for the mongo Db to create a database name called WanderLust

const dbUrl = process.env.ATLAS_DB_URL;
main().then(()=>{
    console.log("Server Connected to Db ")
})
.catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("Error in mongo session storage",err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 7* 24 * 60 * 60 * 1000,
        maxAge: 7* 24 * 60 * 60 * 1000,
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})
app.use("/listings",Listingrouter);
app.use("/listings/:id/reviews",Reviewrouter);
app.use("/",Userrouter);





app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found")) 
})
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render("listing/error.ejs",{message});
})

app.listen(8080 ,()=>{
    console.log("App is listening to the Port ")
});


