const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams to access the params from the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const { createReview, deleteReview } = require("../constrollers/reviews.js");

//cut same part form listings/:id/reviews

// Post reviews Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(deleteReview),);

module.exports = router;
