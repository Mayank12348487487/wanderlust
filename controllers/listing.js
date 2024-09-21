const { response } = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const maptilerclient = require("@maptiler/client");
maptilerclient.config.apiKey = "ma4PobCyXzvM0cLxZYfm";





module.exports.index = async (req,res)=>{
    const allListing = await Listing.find({});
    res.render("listing/index.ejs",{allListing})  
  }

  module.exports.renderNewForm = (req,res)=>{
    
    res.render("listing/new.ejs")
}

module.exports.showListing = async (req,res)=>{
  const listing = await Listing.findById(req.params.id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
  if(!listing){req.flash("error","Hotel Not Found");
       res.redirect("/listings")
      }
      
  res.render("listing/show.ejs",{listing})  
};

module.exports.createListing = async (req,res)=>{

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);

  newListing.owner = req.user._id;
  newListing.image = {url, filename};


 
  await newListing.save();
 
  req.flash("success","Hotel is now Public to everyone");
  res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
  const listing = await Listing.findById(req.params.id);
  res.render("listing/edit.ejs",{listing})  
}
module.exports.updateListing = async (req,res)=>{
  let {id} = req.params;


  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if( typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
  }
 
  req.flash("success","Hotel Updated Successfully");
  res.redirect("/listings");
   
}
module.exports.deleteListing = async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id);
  
  req.flash("success","Hotel Deleted Successfully");
  res.redirect("/listings");
}

module.exports.listByCategory = async (req, res) => {
  try {
      const allListing = await Listing.find({ category: req.params.category });
      res.render("listing/index.ejs", { allListing });
  } catch (err) {
  
      console.error(err);
      req.flash("error", "Could not find Hotels for this category.");
      res.redirect("/listings");
  }
};

module.exports.booklisting = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render("listing/book.ejs", { listing });
}