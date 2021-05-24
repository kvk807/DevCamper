const advancedResults = (model, populate) => async (req, res, next) => {
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
  query = model.find(JSON.parse(queryStr));
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
  const total = await model.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  /////////////////////////////////
  // Execute our query  ///////////
  /////////////////////////////////
  const results = await query;

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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedResults;
