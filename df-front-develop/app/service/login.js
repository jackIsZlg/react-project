'use strict';

const Service = require('egg').Service;

class LoginService extends Service {
  constructor(ctx) {
    super(ctx);
    this.config = this.ctx.app.config.news;
    this.serverUrl = this.config.serverUrl;
    this.pageSize = this.config.pageSize;
  }

  /**
   * @param {String} api - Api name
   * @param {Object} [opts] - urllib options
   * @return {Promise} response.data
   */
  async request(api, opts) {
    const options = Object.assign({
      method: 'GET',
      dataType: 'json',
      timeout: [ '30s', '30s' ],
    }, opts);

    const result = await this.ctx.curl('http://df-gray.zhiyitech.cn/auth/phone-login', options);

    return result;
  }

  async check(body) {
    const opts = {
      method:'POST',
      data:{
          mobile:body.mobile,password:body.password
      }
  }
  const result = await this.request(1111,opts);
  return result.articles
  }
}

module.exports = LoginService;
