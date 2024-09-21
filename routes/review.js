const express = require("express");
const router = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");

const {isLoggedIn, isReviewAuthor} = require("../middleware.js");
const {validateReview} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
 


// Review Route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
   
   // Delete Review Route
   
   router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

   module.exports = router;