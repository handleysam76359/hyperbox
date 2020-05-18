var { HyperdriveClient } = require('hyperdrive-daemon-client')

class Remote {
  constructor ({ endpoint, token }) {
    this.hyperdrive = new HyperdriveClient(endpoint, token)
  }

  async loadArchive (key) {
    await this.hyperdrive.ready()
    return this.hyperdrive.drive.get({ key })
  }
}

module.exports = Remote
