module.exports = function (req, res) {
  delete require.cache[require.resolve('./query')]
  const query = require('./query')

  const code = req.query.code

  const authData = query().data
  const result = authData.resourceList.some(resource => resource.code === code)

  return {
    code: 0,
    data: {
      result
    }
  }
}
