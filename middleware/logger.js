// @desc  function to log out the path of our route
const logger = (req, res, next) => {
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  )
  next()
}

module.exports = logger
