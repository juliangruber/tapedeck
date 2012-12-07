var shoe = require('shoe')
var through = require('through')

var tape = window.tape = through()

var sock = shoe('/stream')
tape.pipe(sock)

sock.on('data', function (data) {
  if (data.match('reload')) {
    console.log('reload')
    window.location.href = window.location.href
  }
})
