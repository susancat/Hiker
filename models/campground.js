var mongoose = require("mongoose");

//schema setup
var campgroundSchema = new mongoose.Schema ({
    name: String,
    level: String,
    // price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }] 
});


//compile into an exported model
module.exports = mongoose.model("Campground",campgroundSchema);