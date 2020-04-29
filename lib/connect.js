var { HyperdriveClient } = require('hyperdrive-daemon-client')

class Connection {
  constructor (client) {
    this.hyperdrive = client
  }

  static async create ({ endpoint, token }) {
    var client = new HyperdriveClient(endpoint, token)
    return new Connection(await client.ready())
  }

  load (key) {
    return this.hyperdrive.drive.get({ key })
  }
}

module.exports.Connection = Connection
