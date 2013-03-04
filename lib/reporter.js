var pre = document.createElement('pre')
emitter.on('data', function (data) {
  pre.innerHTML += data
})

window.addEventListener('load', function () {
  document.body.appendChild(pre)
})
