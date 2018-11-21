let filters = {}

filters.numberToLetter = (number) => {
  const result = []
  while (number) {
    let t = number % 26
    if (!t) {
      t = 26; --number
    }
    result.push(String.fromCodePoint(t + 64))
    number = ~~(number / 26)
  }
  return result.reverse().join('')
}
export default filters
