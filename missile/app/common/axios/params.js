import moment from 'moment'

export default {
  /**
   * 转换参数
   *
   * @param {Object} [params] - 参数对象
   * @returns {Object}
   */
  parseParams (params) {
    const result = {}

    if (params) {
      Object.keys(params).forEach(key => {
        const value = this.parseValue(params[key])

        // 递归处理
        if (typeof params[key] === 'object') {
          params[key] = this.parseParams(params[key])
        }

        // 过滤空值
        result[key] = value
      })
    }

    return result
  },
  /**
   * 处理参数
   * 目前只处理 字符串前后空格和日期格式
   *
   * @param {any} value
   * @returns
   */
  parseValue (value) {
    let result = value

    if (typeof value === 'string') {
      result = value.trim()
    } else if (value instanceof moment) {
      // antd 日期组件默认返回 moment 格式
      result = value.format('YYYY-MM-DD')
    }

    if (value == null) {
      result = ''
    }

    return result
  }
}
