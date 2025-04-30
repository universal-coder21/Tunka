if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const WrapAsync = require("./utils/WrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const { listingSchema,reviewschema } = require("./schema.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const dbUrl=process.env.ATLASDB_URL;

const listingRouter=require("./router/listing.js");
const reviewRouter=require("./router/reviews.js");
const userRouter=require("./router/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_url = "mongodb://127.0.0.1:27017/wanderlust";
// const dbUrl=process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_url);
}

const store=MongoStore.create({
  mongoUrl:MONGO_url,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})

store.on("error",()=>{
 console.log("ERROR in MOngo session store", err);
})

const sessionOptions={
  store,
   secret:process.env.SECRET,
   resave:false,
   saveUninitialized:true,
   cookie:{
      expires:Date.now()+7*24*60*60*1000,
      maxAge:7*24*60*60*1000,
      httpOnly:true,
   }
};

// app.get("/", (req, res) => {
//   res.send("wanderlust working");
// });

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

app.use(passport.initialize());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*", ( req, res, next) => {
  next(new ExpressError(404, "page not fount"));
});

app.use((err, req, res, next) => {
  console.log(err);
  let { status = 400, message = "some error occured" } = err;
 // res.status(status).send(message);
 res.render("error.ejs",{err});
});


app.listen(8080, () => {
  console.log("listening on port 8080");
});