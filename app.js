// require('dotenv').config();
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
// console.log(process.env);
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

app.use(methodOverride("_method"));

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL ;

main()
    .then(() => { console.log("conneted to DB") })
    .catch((err) => { console.log(err) })
    
async function main() {
    await mongoose.connect(dbUrl);
};

// directries setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//connect-mongo  session
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECREAT,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in MONGO SESSION STORE",err);
    
});

//define ssession  or asociate
const sessionOptions = {
    store ,
    secret: process.env.SECREAT,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};



app.use(session(sessionOptions));//applica cookies
app.use(flash());//flash use
// Passport initialization (must come after session)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));//

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//local variable for flash
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;//current user for nav bar
    // console.log(res.locals.success);
    next();
})

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email:"fake@example.com",
//         username:"fakeUser"
//     });
//     let registeredUser = await User.register(fakeUser, "helloWorld");//
//     res.send(registeredUser);
// }); nbvc

// root route
// app.get("/", (req, res) => {
//     res.send("hi, Iam root");
// });

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", userRoute);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wroung" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.send("something when wrong");
})


app.listen(port, () => {
    console.log(`server is listening to part ${port}`);
});

