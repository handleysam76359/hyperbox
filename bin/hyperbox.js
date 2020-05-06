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
  var server = usemail({ authOptional: true, logger: true })
  server.from(spf({ reject: ['Fail', 'SoftFail'] }))
  server.use(usemail.parse())
  server.use(hyperbox({ dat }))

  return server.listen(port)
}

run(main)
