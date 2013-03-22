window.onerror = function (err) {
  console.log(err);
  throw err;
}

var EventEmitter = require('events').EventEmitter
var http = require('http')

var xws = require('xhr-write-stream')
var ws = xws('/xws')

var emitter = window.emitter = new EventEmitter()

console = console || {}
console.log = function (data) {
  ws.write(data + '\n')
  emitter.emit('data', data + '\n')
}

;(function check () {
  http.get({ path : '/command' }, function (res) {
    var command = ''
    res.on('data', function (d) { command += d })
    res.on('end', function () {
      if (command == 'reload') {
        window.location.href = window.location.href
      } else if (command == 'quit') {
        window.finished = true
      }
    })
  })
})()
