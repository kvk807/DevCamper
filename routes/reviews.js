const express = require("express");
const { getReviews, getReview } = require("../controllers/reviews");

const Review = require("../models/Review");

const router = express.Router({ mergeParams: true });

//////////////////////////////////////
// Add middleware to protect routes //
//////////////////////////////////////
const { protect, authorize } = require("../middleware/auth.js");
const advancedResults = require("../middleware/advancedResults");

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

router.route("/:id").get(getReview);

module.exports = router;
