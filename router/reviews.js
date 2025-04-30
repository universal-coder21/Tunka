const express=require("express");
const router=express.Router({mergeParams:true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewschema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review=require("../models/review.js")
const {validateReviews,isLoggedin,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

//review route
router.post("/",
  isLoggedin,
  validateReviews,
  WrapAsync(reviewController.postReview));
  
  //delete review route
  router.delete("/:reviewId",
    isLoggedin,
    isReviewAuthor,
     WrapAsync(reviewController.destroyReview));

  module.exports=router;