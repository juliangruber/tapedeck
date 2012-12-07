
# tapedeck

Execute tap(e) tests that require browsers...in your browser!
Meanwhile have your tap output in the console and a comfy watch mode.

## usage

```bash
Usage: tapedeck [FILE/GLOB]... [OPTIONS]

Options:
  -w, --watch  watch mode       
  -h, --html   html reporter

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
