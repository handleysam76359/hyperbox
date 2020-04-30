var Opt = require('stdopt')
var pattern = /^\[(.+)\]/

class Subject extends Opt {
  static parse (subject) {
    if (typeof subject === 'string') {
      return subject
    }
  }

  get dir () {
    return this.use(function (err, subject) {
      if (err) {
        throw new VError(err, 'Failed to read directory from subject')
      }
      var match = subject.match(pattern)
      return match ? match[1] : ''
    })
  }
}

module.exports = Subject
