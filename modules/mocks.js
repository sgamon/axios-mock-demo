'use strict';

/*
 Mock ajax requests.

 You can use mocks to:

 * develop ahead of the swagger implementation
 * develop without a DB or network connection
 * force synthetic result sets
 */

let config = require('./config');
let log = require('./log-mock');


let mock = new AxiosMockAdapter(axios);

// mock data
let ships = [
  {
    "id": 1,
    "name": "Nina"
  },
  {
    "id": 2,
    "name": "Pinta"
  },
  {
    "id": 3,
    "name": "Santa Maria"
  }
];

function allShips(config) {
  log(config);
  return new Promise(function(resolve, reject) {
    resolve([200, ships]);
  });
}

// pick a single ship by id
function aShip(config) {

  let status = 200;
  let data = {};

  config = config || {params: {}};
  if (config.params && config.params.id) {
    let index = config.params.id - 1;
    if (ships[index]) {
      data = ships[index];
    }
  } else {
    status = 500;
    data = {error: "bad id"};
  }

  log(config, status);
  return new Promise(function(resolve, reject) {
    let response = [status, data];
    if (status == 200) {
      resolve(response);
    } else {
      reject(response);
    }
  });
}


// mock paths
if (config.useMocks) {
  // mock.onGet('/columbus/ships').reply(ships); // returns ship list in a promise
  mock.onGet('/columbus/ships').reply(allShips); // same as above, but with logging
  mock.onGet('/columbus/ship').reply(aShip); // ex: /columbus/ship?id=2
}

module.exports = config.useMocks;
