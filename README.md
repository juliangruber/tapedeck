
# tapedeck

Execute tap(e) tests that require browsers...in your browser!
Meanwhile have your tap output in the console and a comfy watch mode.

`tapedeck` uses browserify for bundling your files.

Except for the `watch` mode everything works down to Internet Explorer 7!

[![Build Status](https://travis-ci.org/juliangruber/tapedeck.png)](https://travis-ci.org/juliangruber/tapedeck)

## usage

```bash
Usage: tapedeck [FILE/GLOB]... [OPTIONS]

Options:
  -w, --watch                 watch mode       
  -h, --html                  html reporter
  -p, --phantom, --phantomjs  test headlessly with phantomjs
```

### normal mode

tapedeck asks you to open your browser, executes the tests with output on your
console and exits with the proper exit code after the tests are run.

```bash
$ tapedeck test.js
Open up http://localhost:13379 in your browser

TAP version 13
# editable
ok 1 input changed
ok 2 stream received data
ok 3 el changed

1..3
# tests 3
# pass  3

# ok 

$ echo $?
0
```

### watch mode

tapedeck keeps the session open and reruns the tests whenever a file changes,
thanks to browserify's magic watch powers.

```bash
$ tapedeck test/*.js -w
Open up http://localhost:34264 in your browser

TAP version 13
# editable
ok 1 input changed
not ok 2 stream received data
  ---
    operator: equal
    expected: "it changed"
    actual:   false
  ...
ok 3 el changed

1..3
# tests 3
# pass  2
# fail  1
TAP version 13
# editable
ok 1 input changed
ok 2 stream received data
ok 3 el changed

1..3
# tests 3
# pass  3

# ok 
```

### phantomjs

BRAND NEW: use phantomjs to run you tests headlessly. This way you don't need
to open a browser, phantomjs does all that for you.

```bash
$ tapedeck test/*.js -p
TAP version 13
# editable
ok 1 input changed
ok 2 stream received data
ok 3 el changed

1..3
# tests 3
# pass  3

# ok 
```

Combine with `watch` for super powers!

### html reporter

Shows the tests output directly in your browser. Use with caution, this may
break some tests that do DOM stuff like `document.querySelector('pre')`.
One `<pre>` is inserted in the body.

Combine with `watch` for super powers!

```bash
$ tapedeck test.js --html
Open up http://localhost:22804 in your browser
```

![html reporter](http://i.imgur.com/TDC8c.png)

## installation

```bash
$ sudo npm install -g tapedeck
```

## license

(MIT)

Copyright (c) 2012 &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
