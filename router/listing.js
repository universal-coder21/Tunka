const express=require("express");
const router=express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })


//index route
router.route("/")
.get( WrapAsync(listingController.index))
.post(
  isLoggedin,
  upload.single('listing[image]'),
  validateListing,
  WrapAsync(listingController.createListing) );
// .post( upload.single('listing[image]'),(req,res,next)=>{
//    res.send(req.file);
// })
  
  
  //new route
  router.get("/new", isLoggedin,listingController.renderNewform  );


  router.route("/:id")
  .get( 
    WrapAsync(listingController.showListing) )
  .put(
      isLoggedin, isOwner,
      upload.single('listing[image]'),
      validateListing,
      WrapAsync(listingController.updateListing))
  .delete(
    isLoggedin, isOwner,
    WrapAsync(listingController.deleteListing) );
  
  
  //Edit route
  router.get(
    "/:id/edit",isLoggedin, isOwner,
    WrapAsync(listingController.editListing));
  

  


  module.exports=router;
  