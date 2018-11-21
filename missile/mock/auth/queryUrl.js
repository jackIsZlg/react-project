module.exports = function (req, res) {
  delete require.cache[require.resolve('./query')]
  const query = require('./query')

  let result = []

  const authData = query().data
  authData.resourceList.forEach(item => {
    const resourceUrl = item.resourceUrl
    if (resourceUrl) {
      let urls = resourceUrl.split(/\s+/)
      urls = urls.filter(url => !!url).map(url => url.trim())

      // 支持多个菜单空白分割
      result = result.concat(urls)
    }
  })

  return {
    code: 0,
    data: {
      urls: result
    }
  }
}
