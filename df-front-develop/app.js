module.exports = (app) => {
  // app.config.coreMiddleware.unshift('authCheck')
  app.config.coreMiddleware.unshift('httpProxy')
  app.config.coreMiddleware.unshift('gzip')
} 