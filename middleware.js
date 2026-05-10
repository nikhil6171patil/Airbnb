const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, ".." , req.originalUrl);

  if (!req.isAuthenticated()) {
    req.session.redirectUrl  = req.originalUrl; 
    req.flash("error", "you must be signed in to create a new listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// check if the user is the owner of the listing
module.exports.isOwner = async(req,res,next) => {
  let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
      req.flash("error","you don't have permission");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

// check if the user is the author of the review  
module.exports.isReviewAuthor = async(req,res,next) => {
  let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
      req.flash("error","you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
    next();
};

// validateion in for middlewar
module.exports.validateListing = async(req, res, next) => {
  //Joi
  let { error } = listingSchema.validate(req.body);
  // console.log(result.error);
  if (error) {
    // Joi gives detailed messages like '"listing" is required'
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports.validateReview = async(req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }

};