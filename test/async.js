var test = require('tape')

test('async', function (t) {
  t.plan(2)

  t.equal(1, 1, 'before timeout')

  setTimeout(function () {
    t.equal(1, 1, 'after timeout')
    t.end()
  }, 10)
})
