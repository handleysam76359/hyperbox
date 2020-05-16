var { Args, StringArgument } = require('stdarg')
var { number } = require('stdopt')
var { run, text } = require('stdrun')
var Connection = require('../lib/connect')
var hyperbox = require('../lib/hyperbox')
var spf = require('usemail-spf')
var usemail = require('usemail')

var command = new Args()
command.use(['remote', 'r'], 'Configuration file for remote hypedrive', StringArgument)
command.use(['port', 'p'], 'Port to use for SMTP server', number)
command.use(['log', 'l'], 'Switch on SMTP logging')
command.use(['help', 'h'], 'Display Hyperbox command help')

async function main () {
  var argv = Array.from(arguments)
  var conf = command.parse(argv)

  if (conf.help) {
    return command.help().map(text)
  }

  var dat = await Connection.configure(conf.remote)
  var server = usemail({ authOptional: true, logger: conf.log })
  server.from(spf({ reject: ['Fail', 'SoftFail'] }))
  server.use(usemail.parse())
  server.use(hyperbox({ dat }))

  return server.listen(conf.port)
}

run(main)
