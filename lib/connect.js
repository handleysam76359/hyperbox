var { HyperdriveClient } = require('hyperdrive-daemon-client')
var { readFile } = require('fs')

class Connection {
  constructor (client) {
    this.hyperdrive = client
  }

  static async configure (file) {
    var { endpoint, token } = await readConfig(file)
    var client = new HyperdriveClient(endpoint, token)
    return new Connection(await client.ready())
  }

  loadArchive (key) {
    return this.hyperdrive.drive.get({ key })
  }
}

module.exports = Connection

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
