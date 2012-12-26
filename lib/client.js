var EventEmitter = require('events').EventEmitter
var shoe = require('shoe')

var sock = shoe('/stream')
var emitter = window.emitter = new EventEmitter()

if (typeof console == 'undefined') console = {}
console.log = function (data) {
  sock.write(data)
  emitter.emit('data', data)
}

sock.on('data', function (data) {
  if (data.match('reload')) {
    window.location.href = window.location.href
  }
})
