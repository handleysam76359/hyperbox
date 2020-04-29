var { Connection } = require('../lib/connect')
var { number, nothing, string } = require('stdopt')
var { run, text } = require('stdrun')
var { readFile } = require('fs')
var { start } = require('../lib/smtp')

async function hyperbox (opts = {}) {
  var cfgPath = string(opts.config).or(opts.c).or('./config.json').value()
  var port = number(opts.port).or(opts.p).or(nothing).value()

  var config = await readConfig(cfgPath)
  var hd = await Connection.create(require('../config'))
  var address = await start({ hd, port })

  return text`Hyperbox started on port ${address.port}`
}

run(hyperbox)

/**
 * Helpers
 */
async function readConfig (path) {
  return new Promise((resolve, reject) => {
    readFile(path, (err, cfg) => {
      if (err) {
        console.warn('Failed to read config: ' + path)
        resolve({})
      }

      try {
        resolve(JSON.parse(cfg))
      } catch (err) {
        reject(err)
      }
    })
  })
}
