var EventEmitter = require('events').EventEmitter
var shoe = require('shoe')

var sock = shoe('/stream')
var emitter = window.emitter = new EventEmitter()

if (typeof console == 'undefined') console = {}
console.log = function (data) {
  sock.write(data + '\n')
  emitter.emit('data', data + '\n')
}

sock.on('data', function (data) {
  if (data.match('reload')) {
    window.location.href = window.location.href
  } else if (data.match('quit')) {
    window.finished = true
  }
})
