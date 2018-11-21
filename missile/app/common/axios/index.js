import axios from 'axios'
import qs from 'qs'
import paramsUtil from './params'
import { baseURI, apiPrefix } from 'common/config'

function throwHttpError (message, code) {
  const error = new Error(message)
  error.name = 'HttpError'
  error.code = code
  error.errMessage = message
  throw error
}

const instance = axios.create({
  baseURL: baseURI + apiPrefix,
  headers: {
    'x-requested-with': 'XMLHttpRequest',
    'Content-Type': 'application/json;charset=utf-8'
  },
  paramsSerializer (params) {
    params = paramsUtil.parseParams(params)

    // koa 使用 querystring.pare 解析
    // 'foo=bar&abc=xyz&abc=123' => { foo: 'bar', abc: ['xyz', '123'] }
    return qs.stringify(params, {
      skipNulls: true,
      arrayFormat: 'repeat',
      encoder: function (str) {
        return encodeURIComponent(str)
      }
    })
  },
  transformRequest (data, header) {
    data = paramsUtil.parseParams(data)
    return JSON.stringify(data)
  }
})

instance.interceptors.response.use(
  function (response) {
    let result = response.data
    if (!result) {
      throwHttpError('请求异常！')
    }

    if (typeof result !== 'object') {
      throwHttpError('返回数据格式异常！')
    }

    if (result.code !== 0) {
      throwHttpError(result.error || '请求异常！', result.code)
    }

    return result.data
  },
  function (error) {
    if (error.response) {
      throwHttpError('请求异常：' + error.response.statusText)
    }

    if (error.request) {
      throwHttpError('请求异常：无返回结果')
    }

    throwHttpError(error.message)
  }
)

export default instance
