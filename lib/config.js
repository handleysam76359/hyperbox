var { Opt, OptError, hash, nothing, string } = require('stdopt')
var fs = require('fs')

class Config extends Opt {
  static parse (c) {
    return hash(c, this.struct).catch('Invalid Hyperbox configuration')
  }

  static get struct () {
    return {
      remote: [nothing, RemoteConfig]
    }
  }
}

class RemoteConfig extends Opt {
  static parse (c) {
    if (typeof c === 'string') {
      try {
        var json = c
        if (fs.existsSync(c)) json = fs.readFileSync(c, 'utf-8')
        return hash(JSON.parse(json), this.struct)
      } catch (err) {
        return new OptError(err, 'Failed to parse RemoteConfig')
      }
    } else {
      return hash(c, this.struct)
    }
  }

  static get struct () {
    return {
      endpoint: string,
      token: string
    }
  }
}

module.exports = Config
