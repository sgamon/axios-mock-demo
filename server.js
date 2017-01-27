// A very minimal express server.

let express = require('express');
let open = require('open');


const PORT = 3001;

express()
  .set('port', PORT)
  .use('/', express.static(__dirname))
  .listen(PORT, function() {
  console.log(`Server started: http://localhost:${PORT}/`);
});

open('http://localhost:3001/');
