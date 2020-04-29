var { SMTPServer } = require('smtp-server')
var { join } = require('path')
var { simpleParser } = require('mailparser')

function start ({ hd, port }) {
  var server = new SMTPServer({
    authOptional: true,
    onData: handle
  })

  function handle (stream, session, done) {
    simpleParser(stream).then(async data => {
      var addr = data.to.text
      var sep = addr.indexOf('@')

      var key = addr.substring(0, sep)
      var archive = await hd.load(key)
      var file, name

      for await (file of data.attachments) {
        name = join(data.subject, file.filename)
        await archive.writeFile(name, file.content)
      }
    }).then(done, err => {
      console.error(err)
      done(err)
    })
  }

  return new Promise((resolve, reject) => {
    server.listen(port, function (err) {
      if (err) reject(err)
      else resolve(this.address())
    })
  })
}

module.exports.start = start
