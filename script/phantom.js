var page = require('webpage').create();
var args = require('system').args;

page.open(args[1], function () {
  function finished () {
    return page.evaluate(function () {
      return !! window.finished;
    }); 
  }
  
  setInterval(function () {
    if (finished()) phantom.exit();
  }, 50);
});
