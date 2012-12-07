var test = require('tape')

test('rewrites', function (t) {
  t.equal("console.log('hi')", "tape.write('hi')", 'fn()')
  t.equal(
    "console.log.bind(console)('bind')",
    "tape.write.bind(tape)('bind')",
    'fn#bind'
  )
  t.equal(
    "console.log.apply(console, ['apply'])",
    "tape.write.apply(tape, ['apply'])",
    'fn#apply'
  )
  t.equal(
    "console.log.call(console, 'call')",
    "tape.write.call(tape, 'call')",
    'fn#call'
  )
  t.end()
})
