#!/usr/bin/env node

var browserify = require('browserify')
var fs = require('fs')
var html = fs.readFileSync(__dirname + '/lib/index.html')
var spawn = require('child_process').spawn
var phantomjs = require('phantomjs')
var freeport = require('freeport')
var xws = require('xhr-write-stream')()

// configuration
var dir = '/tmp/' + Math.random().toString(16).slice(2)

var argv = require('optimist')
  .usage('Usage: $0 [FILE/GLOB]... [OPTIONS]')
  
  .describe('w', 'watch mode')
  .alias('w', 'watch')

  .describe('h', 'html reporter')
  .alias('h', 'html')

  .describe('p', 'test headlessly with phantomjs')
  .alias('p', 'phantom')
  .alias('p', 'phantomjs')

  .demand('_')
  .argv

var test = argv._[0]
var failed = false

// static test code
var b = browserify()
b.on('syntaxError', console.error)
b.addEntry(__dirname + '/lib/client.js')
var client = b.bundle()

fs.mkdirSync(dir)
fs.writeFileSync(dir + '/index.html', html)
fs.writeFileSync(dir + '/tapedeck.js', client)

// html reporter
var reporter = argv.h && !argv.phantomjs
  ? browserify().addEntry(__dirname + '/lib/reporter.js').bundle()
  : ''
fs.writeFileSync(dir + '/reporter.js', reporter)  

/**
 * tests bundle
 */

var glob = require('glob').sync

// collect test files
var entries = []

argv._.forEach(function (filename) {
  entries.push.apply(entries, glob(filename))
})

var bundled
var bundle = browserify({
  watch : argv.w,
  entry : entries
})

// create initially
onBundle()
// update when watching
bundle.on('bundle', onBundle)

function onBundle() {
  bundled = bundle.bundle()
  fs.writeFileSync(dir + '/tests.js', bundled)
}

/**
 * network
 */

// http
var http = require('http')
var ecstatic = require('ecstatic')
var EventEmitter = require('events').EventEmitter
var serve = ecstatic(dir)
var server = http.createServer()

var events = new EventEmitter()
if (argv.w) {
  var lastChange
  fs.watch(dir + '/tests.js', function () {
    var tooEarly = Date.now() - lastChange < 1500
    if (lastChange && tooEarly) return
    lastChange = Date.now()
    events.emit('reload')
  })
}

server.on('request', function (req, res) {
  if (req.url != '/xws') return

  req.pipe(xws(function (stream) {
    stream.pipe(process.stdout, { end : false })
    if (!argv.w) {
      var data = ''
      stream.on('data', function (d) {
        data += d
        var isOk = data.match('# ok')
        var isFail = data.match('# fail')

        if (!isFail && !isOk) return
        if (isFail) failed = true
        events.emit('quit')
        setTimeout(process.exit.bind(process))
      })
      return 
    }
  }))
  req.on('end', res.end.bind(res))
})

server.on('request', function (req, res) {
  if (req.url != '/command') return

  function quit () { res.end('quit'); end() }
  function reload () { res.end('reload'); end() }

  events.once('quit', quit)
  events.once('reload', reload)

  req.on('close', end)

  function end () {
    events.removeListener('quit', quit)
    events.removeListener('reload', reload)
  }
})

server.on('request', function (req, res) {
  if (req.url == '/command' || req.url == '/xws') return
  serve(req, res)
})

freeport(function (err, port) {
  if (err) throw err

  server.listen(port, function () {
    var addr = 'http://localhost:' + port + '/';
    if (argv.phantomjs) {
      var ps = spawn(phantomjs.path, [
        __dirname + '/script/phantom.js', addr
      ])
      ps.stderr.pipe(process.stderr)
    } else {
      console.log('Open up ' + addr + ' in your browser\n')
    }
  })
})  

/**
 * clean up
 */

process.on('SIGINT', cleanup)
process.on('exit', cleanup)

var cleanedUp = false
function cleanup () {
  // only once
  if (cleanedUp) return
  cleanedUp = true
  fs.unlinkSync(dir + '/index.html')
  fs.unlinkSync(dir + '/tapedeck.js')
  fs.unlinkSync(dir + '/reporter.js')
  fs.unlinkSync(dir + '/tests.js')
  fs.rmdirSync(dir)
  process.exit(failed)
}
