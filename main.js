let mocksEnabled = require('./modules/mocks');

/*
axios config objects require a 'url' property. Default props are:

{
  method: 'get',
  responseType: 'json'
}

Clobber those properties if you need to force them.

For query params (ie, GET method, set 'params' prop.
For body (ie, POST, PUT, DELETE), set 'data' prop.
 */

let getAllShipsConfig = {
  url: '/columbus/ships'
};

let getShip1Config = {
  url: '/columbus/ship',
  params: {id:1}
};


// Example of how to translate a jquery config to an axios config -
let jquery2axios = require('./modules/jquery2axios');
let jqueryConfig = { // this is a jquery config
  url: '/columbus/ship',
  method: 'GET',
  data: {id:2},
  responseType: 'json'
};
let getShip2Config = jquery2axios(jqueryConfig); // now we have an axios config!




// Make the calls ------------
let verb = console.dir ? 'dir' : 'log';

axios(getAllShipsConfig)
  .then(function(res){
    console[verb](res.data);
  });

axios(getShip1Config)
  .then(function(res){
    console[verb](res.data);
  });

axios(getShip2Config)
  .then(function(res){
    console[verb](res.data);
  });
