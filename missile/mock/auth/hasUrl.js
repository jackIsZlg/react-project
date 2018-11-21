module.exports = function (req, res) {
  delete require.cache[require.resolve('./queryUrl')]
  const queryUrl = require('./queryUrl')

  const url = decodeURIComponent(req.query.url)

  const urls = queryUrl().data.urls
  const result = urls.some(item => item === url)

  return {
    code: 0,
    data: {
      result
    }
  }
}
