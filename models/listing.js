const mongoose = require("mongoose");
const Review = require("./review");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    description: {
        type: String,
        set: (v) => v === "" ? "defaultLink" : v,
    },
    price: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ["Amazing Pool","Camping","Lake Front","Farms","Beach Front","Mountain","Desert","Country Side","Forest","Vineyard","Historic","Modern","Luxury","Budget","Urban"],
        required: true,  // Make it required if all listings must have a category

    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
