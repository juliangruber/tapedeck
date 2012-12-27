var pre = document.createElement('pre')
emitter.on('data', function (data) {
  pre.innerHTML += data
})

document.addEventListener('load', function () {
  document.body.appendChild(pre)
})

