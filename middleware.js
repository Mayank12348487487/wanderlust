
const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","Please Login First");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,msg);
    }else{
        next();
    }
}

module.exports.validateReview =(req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let msg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,msg);
    }else{
        next();
    }
}

module.exports.isOwner = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You do not have permission to do that");
        return res.redirect(`/listings/${id}`)
    }
    next();
}