import axios from 'axios'
const TOKEN_KEY = process.env.VUE_APP_TOKEN
// import qs from 'qs'
axios.interceptors.request.use(config => {
  if (localStorage.token || sessionStorage.token) {
    config.headers[TOKEN_KEY] = sessionStorage.token || localStorage.token
  }
  return config
}, err => {
  return Promise.reject(err)
})
axios.interceptors.response.use(response => {
  let content = response.data
  if (!content.hasOwnProperty('success')) {
    return content
  }
  if (!content.success) {
    let err = new Error(content.errorDesc)
    err.code = content.errorCode
    throw err
  }
  return content.result
}, err => {
  return Promise.reject(err)
})
axios.formdata = (url, data) => {
  const config = { headers: { 'Content-Type': 'multipart/form-data' } }
  let formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return axios.post(url, formData, config)
  // return axios.post(url, qs.stringify(data))
}
export default axios
