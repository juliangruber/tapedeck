var pre = document.createElement('pre')
document.body.appendChild(pre)

emitter.on('data', function (data) {
  pre.innerHTML += data
})
