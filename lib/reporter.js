var pre = document.createElement('pre')
document.body.appendChild(pre)

tape.on('data', function (data) {
  pre.innerHTML += data
})
