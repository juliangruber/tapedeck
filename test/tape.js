var test = require('tape')

test('test', function (t) {
  t.plan(3)

  t.equals(1,1, 'number')
  t.equals('1', '1', 'string')
  t.equals(1.0, 1.0, 'float')

  t.end()
})
