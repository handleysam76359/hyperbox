var { join } = require('path')
var Subject = require('./subject')

module.exports = function ({ dat }) {
  return async function hyperbox (session, ctx) {
    var rcpt, sep, key, archive, subject

    for (rcpt of session.envelope.rcptTo) {
      sep = rcpt.address.indexOf('@')
      key = rcpt.address.substring(0, sep)
      archive = await dat.loadArchive(key)
      subject = new Subject(ctx.data.subject)
      var file, dir, name

      for await (file of ctx.data.attachments) {
        if (!file.filename) continue
        name = join(subject.dir, file.filename)
        await archive.writeFile(name, file.content)
      }
    }
  }
}
