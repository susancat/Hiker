var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Sunset Peak", 
        level: "Medium",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Climb up to Hong Kong’s third-highest peak for the best natural evening view our territory has to offer. This ambitious hike leads you up the grassy Lantau Trail to a panoramic view from the appropriately named Sunset Peak. As you ascend the highlands, enjoy the Lantau coastline, Pui O and explore the cluster of stone shacks on the way. The romantic view at the summit will make the arduous climb more than worth it. Bus 11, 23, or 3M to Pak Kung Au. From the end point take bus 3M to Tung Chung MTR Station or to Mui Wo Bus Terminal, 3.5 hours."
    },
    {
        name: "Nam Sang Wai Wetlands", 
        level: "easy",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Once known for its infamous fugitive crocodile, Pui Pui, this rural landscape is ideal for a break from the city and a spot of bird watching. There’s no set route to take, simply make your way across the park’s large network of narrow banks between the many ponds. A number of buses go straight to the wetlands. Try either bus 967 from Admiralty or 69X from Jordan."
    },
    {
        name: "Plover Cove Country Park Circular hike",
        level: "hard", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "The main highlight of this trek is Lai Chi Wo, an abandoned Hakka village. The 400-year-old former walled village is home to well-maintained ancestral halls, 211 Hakka houses, temples, monasteries, and quaint public squares. Take minibus 20C from Tai Po Market to Tin Sam Village, Wu Kang Tang. When you finish at Lai Chi Wo, take bus 56K back to Fanling MTR station."
    }
]

function seedDB(){
   //Remove all campgrounds
   Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");

             //add a few campgrounds by loop create
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");

                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}

module.exports = seedDB;
// will send the seedDB() out; if only remove method inside, when send out, all items gone.