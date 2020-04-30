var { number, nothing, string } = require('stdopt')
var { run, text } = require('stdrun')
var Connection = require('../lib/connect')
var hyperbox = require('../lib/hyperbox')
var usemail = require('usemail')

async function main (opts = {}) {
  var config = string(opts.config).or(opts.c).or('./config.json').value()
  var port = number(opts.port).or(opts.p).or(nothing).value()

  var dat = await Connection.configure(config)
  var server = usemail({ authOptional: true })
  server.use(usemail.parse())
  server.use(hyperbox({ dat }))
  await server.listen(port)

  return text`Hyperbox started on port ${server.port}`
}

run(main)
