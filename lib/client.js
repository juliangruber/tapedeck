var shoe = require('shoe')
var sock = shoe('/stream')

if (typeof console == 'undefined') console = {}
console.log = function (data) {
  sock.write(data)  
}

sock.on('data', function (data) {
  if (data.match('reload')) {
    console.log('reload')
    window.location.href = window.location.href
  }
})
