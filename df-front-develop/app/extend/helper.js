module.exports = {
  ossImg(src, w) {
    let _w = w ? `/resize,w_${Math.floor(w * 1)}` : ''
    return `${src}?x-oss-process=image${_w}`
  }
}