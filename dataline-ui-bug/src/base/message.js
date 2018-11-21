class Message {
  _subList = new Map()
  sub(type, callback) {
    if (!this._subList.has(type)) {
      this._subList.set(type, [])
    }
    this._subList.get(type).push(callback)
  }
  pub(type, params) {
    if (this._subList.has(type)) {
      try {
        this._subList.get(type).forEach(m => m(params))
      } catch (error) {
        console.error(error)
      }
    }
  }
}
export default new Message()