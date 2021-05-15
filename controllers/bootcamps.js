// @desc    Get All bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Show all bootcamps' })
}

// @desc    Get single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Show bootcamp ${req.params.id}`, msg: req.heehaw })
}

// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps/:id
// @access  Public
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'Create new bootcamp' })
}

// @desc    Update single bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Update bootcamp ${req.params.id}` })
}

// @desc    Delete single bootcamps
// @route   DELETE /api/v1/bootcamps/:id
// @access  Public
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Delete bootcamp ${req.params.id}` })
}
