var Opt = require('stdopt')

var ERR_DIR = 'Failed to read directory from subject'
var pattern = /^\[(.+)\]/

class Subject extends Opt {
  static parse (subject) {
    if (typeof subject === 'string') {
      return subject
    }
  }

  get dir () {
    var subject = this.catch(ERR_DIR).value()
    var match = subject.match(pattern)
    return match ? match[1] : ''
  }
}

module.exports = Subject
