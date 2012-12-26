#!/usr/bin/env node

var browserify = require('browserify')
var fs = require('fs')
var html = fs.readFileSync(__dirname + '/lib/index.html')

// configuration
var port = Math.round(Math.random() * 65535)
var dir = '/tmp/' + Math.random().toString(16).slice(2)

var argv = require('optimist')
  .usage('Usage: $0 [FILE/GLOB]... [OPTIONS]')
  .alias('w', 'watch')
  .alias('h', 'html')
  .describe('w', 'watch mode')
  .describe('h', 'html reporter')
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
if (argv.h) {
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
server.listen(port, function () {
  console.log('Open up http://localhost:' + port + '/ in your browser\n')
})

// socket
var shoe = require('shoe')
shoe(function (stream) {
  stream.pipe(process.stdout)
  if (!argv.w) {
    stream.on('data', function (data) {
      if (data.match('# ok')) process.exit()
      if (data.match('# fail')) {
        failed = true
        process.exit()
      }
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
  if (argv.html) fs.unlinkSync(dir + '/reporter.js')
  fs.unlinkSync(dir + '/tests.js')
  fs.rmdirSync(dir)
  process.exit(failed)
}
