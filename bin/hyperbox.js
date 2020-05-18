var { Args, StringArgument } = require('stdarg')
var { list, number } = require('stdopt')
var { run, text } = require('stdrun')
var Config = require('../lib/config')
var filter = require('usemail-address-filter')
var hyperbox = require('../lib/hyperbox')
var spf = require('usemail-spf')
var usemail = require('usemail')

var command = new Args()
command.use(['remote', 'r'], 'Configuration file for remote hypedrive', StringArgument)
command.use(['allow', 'a'], 'Email address(es) allowed to post to hyperbox', list.of(StringArgument))
command.use(['port', 'p'], 'Port to use for SMTP server', number)
command.use(['log', 'l'], 'Switch on SMTP logging')
command.use(['help', 'h'], 'Display Hyperbox command help')

async function main () {
  var argv = Array.from(arguments)
  var opts = command.parse(argv)

  if (opts.help) {
    return command.help().map(text)
  }

  var config = new Config(opts).value()
  var server = usemail({ authOptional: true, logger: opts.log })
  server.from(filter.allow({ addresses: opts.allow }))
  server.from(spf({ reject: ['Fail', 'SoftFail'] }))
  server.use(usemail.parse())
  server.use(hyperbox(config))
  server.on('bye', logError)

  return server.listen(opts.port)
}

function logError ({ serverError }) {
  if (serverError) console.error(serverError)
}

run(main)
