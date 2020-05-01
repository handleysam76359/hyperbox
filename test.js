var { sendMail } = require('usemail-test-utils')

var to = '95b69506c8aef0178f089baca522e9f08f01f26137748076ea04273d83f3d019@example.com'
sendMail(2525, { to, from: 'some@example.com' }).catch(() => {})
sendMail(2525, { to, from: 'me@localhost' })
