const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../models/Bootcamp");

// @desc    Get All bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  //////////////////////////
  // Query functionality ///
  //////////////////////////
  let query;
  // Copy req.query
  let reqQuery = { ...req.query };
  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];
  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  // grab the query string from the request object
  let queryStr = JSON.stringify(reqQuery);
  // replace the query string by inserting a '$' into it for mongoose
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // create the query variable by turning the query string back into JSON
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");
  //////////////////////////////
  // Filtering functionality ///
  //////////////////////////////
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
    // console.log(query);
  }
  /////////////////////////////////
  //  Sort functionality  /////////
  /////////////////////////////////
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort({ createdAt: "asc", name: -1 });
  }
  /////////////////////////////////////
  //  Pagination functionality  ///////
  /////////////////////////////////////
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  /////////////////////////////////
  // Execute our query  ///////////
  /////////////////////////////////
  const bootcamps = await query;

  ////////////////////////////////////////
  // Set previous and next page results //
  ////////////////////////////////////////
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  ////////////////////////////////////////
  // Send query results to api endpoint //
  ////////////////////////////////////////
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
    data: bootcamps,
  });
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc    Update single bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    // if the id is correctly formatted but just not found
    return next(
      new ErrorResponse(`Resurce not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete single bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Resurce not found with id of ${req.params.id}`, 404)
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get bootcamps within a given redius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of Earth
  // Earth radius = 3963 milies / 6378 kilometers
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
