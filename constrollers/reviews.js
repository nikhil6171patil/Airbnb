const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async(req, res) => {
    // console.log(req.body);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //pass in backend
    // console.log(req.body.review);
    newReview.author = req.user._id; // set the author of the review to the currently logged in user    
    listing.reviews.push(newReview); // add the new review to the listing's reviews array

  
    await newReview.save();
    await listing.save();

    // console.log("new review saved");
    // res.send("new review saved");
    req.flash("success","New Review Added Successfully!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req ,res) => {
        let { id ,reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId } });// pull operator to remove the review reference from the listing
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted successfully!");
        res.redirect(`/listings/${id}`);
}