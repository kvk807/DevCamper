const NodeGeoCoder = require("node-geocoder");
const dotenv = require("dotenv");

dotenv.config({ path: "../config/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: "https",
  apiKey: process.env.MAPQUEST_API_KEY,
  formatter: null,
};

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;
