#!/usr/bin/env node

var browserify = require('browserify')
var fs = require('fs')
var html = fs.readFileSync(__dirname + '/lib/index.html')
var spawn = require('child_process').spawn
var phantomjs = require('phantomjs')
var freeport = require('freeport')

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
var client = browserify().addEntry(__dirname + '/lib/client.js').bundle()
fs.mkdirSync(dir)
fs.writeFileSync(dir + '/index.html', html)
fs.writeFileSync(dir + '/tapedeck.js', client)

// html reporter
if (argv.h && !argv.phantomjs) {
  var reporter = browserify().addEntry(__dirname + '/lib/reporter.js').bundle()
  fs.writeFileSync(dir + '/reporter.js', reporter)  
}

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
var server = http.createServer(ecstatic(dir))

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

// socket
var shoe = require('shoe')
shoe(function (stream) {
  stream.pipe(process.stdout)
  if (!argv.w) {
    stream.on('data', function (data) {
      var isOk = data.match('# ok')
      var isFail = data.match('# fail')

      if (!isFail && !isOk) return
      if (isFail) failed = true
      stream.write('quit')
      process.exit()
    })
    return 
  }
  
  fs.watch(dir + '/tests.js', function () {
    stream.write('reload')
  })
}).install(server, '/stream')

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
  if (argv.html && !argv.phantomjs) {
    fs.unlinkSync(dir + '/reporter.js')
  }
  fs.unlinkSync(dir + '/tests.js')
  fs.rmdirSync(dir)
  process.exit(failed)
}
