var { join } = require('path')

module.exports = function ({ dat }) {
  return async function hyperbox (session, ctx) {
    var rcpt, addr, sep, key, archive

    for (rcpt of session.envelope.rcptTo) {
      addr = rcpt.address
      sep = addr.indexOf('@')

      key = addr.substring(0, sep)
      archive = await dat.loadArchive(key)
      var file, name

      for await (file of ctx.data.attachments) {
        if (!file.filename) continue
        name = join(ctx.data.subject, file.filename)
        await archive.writeFile(name, file.content)
      }
    }
  }
}
