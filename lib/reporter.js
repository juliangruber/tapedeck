var pre = document.createElement('pre')
emitter.on('data', function (data) {
  pre.innerHTML += data
})

window.onload = function () {
  document.body.appendChild(pre)
}
