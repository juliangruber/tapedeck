var shoe = require('shoe')
var sock = shoe('/stream')

if (typeof console == 'undefined') console = {}
console.log = function () {
  sock.write.apply(sock, arguments)  
}

sock.on('data', function (data) {
  if (data.match('reload')) {
    console.log('reload')
    window.location.href = window.location.href
  }
})
