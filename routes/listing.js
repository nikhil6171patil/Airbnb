const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


const listingController = require("../constrollers/listing.js");
const multer = require("multer");
const {storage} = require("../CloudConfig.js")
const upload = multer({ storage });

router.route("/")
  .get( wrapAsync(listingController.index))//index Route
  // .post( upload.single('listing[image]'),(req,res)=>{
  //   res.send(req.file);
  //   console.log(req.file);
  // });
  // Create Route
  .post( isLoggedIn,
    upload.single("listing[image]"),
    validateListing, // validate the data before creating a new listing /  middelware call
      wrapAsync(listingController.createListing),
);
   
// listing New Route
router.get("/new", isLoggedIn, listingController.newForm);


router
  .route("/:id") 
  //show route
  .get(wrapAsync(listingController.showListing))
  //Update Route
  .put( 
    isLoggedIn, 
    isOwner,  
    upload.single("listing[image]"),
    validateListing,  
    wrapAsync(listingController.updateListing)
  )
  //delete Route
  .delete(
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.deleteListing))

    
//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.editForm),
);


module.exports = router;
  