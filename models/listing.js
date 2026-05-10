const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url:String,
        filename: String,
        // default: "https://cdn.twocontinents.com/hfpqy_V7_B_IMG_Dubai_UAE_1200x800_e1936b3330.jpg",

        // set: (v) => v === "" ? "https://cdn.twocontinents.com/hfpqy_V7_B_IMG_Dubai_UAE_1200x800_e1936b3330.jpg" : v, // image

    },
    price: Number,
    location: String,
    country: String,
    reviews: [{ // object id reviews store in array
        type: Schema.Types.ObjectId,
        ref: "Review",
    },],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in :listing.reviews}}); // delete all reviews that have id in listing.reviews   
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;