 const Listing=require("./models/listing");
 const Review=require("./models/review");
 const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewschema } = require("./schema.js");

module.exports.isLoggedin=(req,res,next)=>{
  req.session.redirectUrl=req.originalUrl
    if(!req.isAuthenticated()){
        req.flash("error","You must be logged in to create new listing");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}

module.exports.isOwner= async(req,res,next)=>{
  let {id}=req.params;
  let listing =await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You don't have permission to edit");
    return res.redirect(`/listing/${id}`);
  }
  next();
}

//validate listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//validate Reviews
module.exports.validateReviews = (req, res, next) => {
  let { error } = reviewschema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports.isReviewAuthor= async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review =await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
}