var { join } = require('path')
var Local = class {}
var Remote = require('./remote')
var Subject = require('./subject')

module.exports = function (config) {
  var hyperdrive = config.remote
    ? new Remote(config.remote)
    : new Local()

  return async function hyperbox (session) {
    var rcpt, sep, key, archive, subject

    for (rcpt of session.to) {
      sep = rcpt.indexOf('@')
      key = rcpt.substring(0, sep)
      archive = await hyperdrive.loadArchive(key)
      subject = new Subject(session.get('subject'))
      var file, dir, name

      for await (file of session.get('attachments')) {
        if (!file.filename) continue
        name = join(subject.dir, file.filename)
        await archive.writeFile(name, file.content)
      }
    }
  }
}
