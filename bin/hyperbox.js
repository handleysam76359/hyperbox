var { number, nothing, string } = require('stdopt')
var { run, text } = require('stdrun')
var Connection = require('../lib/connect')
var hyperbox = require('../lib/hyperbox')
var spf = require('usemail-spf')
var usemail = require('usemail')

async function main (opts = {}) {
  var config = string(opts.config).or(opts.c).or('./config.json').value()
  var port = number(opts.port).or(opts.p).or(nothing).value()

  var dat = await Connection.configure(config)
  var server = usemail({ authOptional: true })
  server.use(spf({ reject: ['Fail', 'SoftFail'] }))
  server.use(usemail.parse())
  server.use(hyperbox({ dat }))
  server.on('bye', log)
  await server.listen(port)

  return text`Hyperbox started on port ${server.port}`
}

function log (session, context) {
  var address = session.envelope.mailFrom.address

  if (context.internalError) {
    var err = context.internalError
    console.error(`<${address}> ${err.name}: ${err.message}`)
  } else {
    console.log(`<${address}> Mail handled`)
  }
}

run(main)
