const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn} = require("../middleware.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const multer = require("multer");

const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const { route } = require("./user.js");
const {storage} = require("../cloudConfig.js");

const upload = multer({storage});
router
.route("/")
// Index Route
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));




router
.route("/new")
.get(isLoggedIn,listingController.renderNewForm);

  router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,wrapAsync(listingController.deleteListing));


  router
  .route("/:id/edit")
  .get(wrapAsync(listingController.renderEditForm));

  router
  .route("/:id/booking")
  .get(isLoggedIn,wrapAsync(listingController.booklisting));

  router
  .route("/category/:category")
  .get(wrapAsync(listingController.listByCategory));


  
  
  
  
  module.exports = router;

  