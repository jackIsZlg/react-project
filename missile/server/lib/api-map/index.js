const papayaApiMap = require('@wac/papaya-api-map')
const mapConfig = require('./map-config')
const { baseURI, apiPrefix, backendMap } = require('../config')

module.exports = papayaApiMap(
  { prefix: baseURI + apiPrefix, domain: backendMap },
  mapConfig
)
