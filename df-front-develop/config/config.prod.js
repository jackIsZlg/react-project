module.exports = () => {
  const config = {
    targetUrl: 'http://192.168.0.152:8080/',
    alinode: {
      server: 'wss://agentserver.node.aliyun.com:8080',
      appid: '51990',
      secret: '0b0df124231598cedcb188b02d0ec0eca039d3da',
      logdir: '/tmp/',
      error_log: [
        '/root/.logs/error.#YYYY#-#MM#-#DD#.log',
      ]
    }
  }
  return config
}
