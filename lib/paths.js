var { Opt, string } = require('stdopt')

var ERR_SUBJECT = 'Failed to read paths from subject'
var pattern = /^\[(.+)\]/

class Paths extends Opt {
  static parse (subject) {
    if (typeof subject === 'string') {
      var match = subject.match(pattern)
      return match ? this.split(match[1]) : []
    }
  }

  static split (str) {
    var char, prev
    var paths = ['']

    for (char of str) {
      if (prev === '\\' || /\S/.test(char)) {
        paths[paths.length - 1] += char
      } else {
        paths.push('')
      }
      prev = char
    }

    return paths
  }

}

module.exports = Paths
