var mongoose = require("mongoose");

var MarkerRoutes = mongoose.model("MarkerRoutes", {
  name: {
    type: String,
    default: "Unknown"
  },
  routes: [{
    type : Array ,
    default : []
  }],
  image: {
    type: String,
    default: "Unknown"
  }
});

module.exports = { MarkerRoutes };
