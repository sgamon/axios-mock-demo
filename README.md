# axios-mock-demo

Example of mocking ajax data using axios.

You can use client-side mocks to:

* develop ahead of the back-end implementation
* develop without a DB or network connection
* force synthetic result sets

This is a pure-browser example. A tiny express webserver is provided to serve 
the files.

The javascript files in this demo use ES6 - no effort is made to transpile. Run
it in a modern browser.


## Install

    npm install


## Run

    npm start
    
    
Output is shown in the console window, so open that to observe.


## Guided Tour


### index.html

In the head, we load axios, and Colin Timmermans' axios-mock-adaptor. At the 
bottom of the body, we load main.js.

We use `require1k.min.js` to treat our javascript files as CommonJS modules.


### main.js

We load the `mocks.js` file from the modules folder. See details of this file 
below. 

    let mocksEnabled = require('./modules/mocks');
    

We create a couple of mundane config objects to pass to axios. These should be 
familiar to you:

    let getAllShipsConfig = {
      url: '/columbus/ships'
    };
    
    let getShip1Config = {
      url: '/columbus/ship',
      params: {id:1}
    };

Next, you'll see some sample code to demonstrate how you can translate jQuery 
ajax configs into axios configs. If you are converting from jQuery to axios, 
this may interest you.

    // Example of how to translate a jquery config to an axios config -
    let jquery2axios = require('./modules/jquery2axios');
    let jqueryConfig = { // this is a jquery config
      url: '/columbus/ship',
      method: 'GET',
      data: {id:2},
      responseType: 'json'
    };
    let getShip2Config = jquery2axios(jqueryConfig); // now we have an axios config!

At last, we make a series of axios calls, and print the results to the console.

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



### modules/config.js

I like to have a config file where I can wiggle the settings in my apps. In this
case, we set a boolean property that indicates if we want to use mocks or not.

    module.exports = {
      useMocks: true //TODO set to false
    };
    

### modules/log-mock.js

If you are familiar with the jQuery mockjax plugin, you know that whenever
mockjax intercepts an ajax call, it logs the call to the console. Sadly, 
axios-mock-adaptor does not do that.  So I created a little method to simulate 
the effect:

    module.exports = function(config, status=200) {
      let verb = console.info ? 'info' : 'log';
      console[verb](`MOCK AXIOS: ${config.method.toUpperCase()} ${config.url}${constructQS(config.params)} - ${status}`);
    };


### modules/constructQS.js

Another little helper method. axios config objects pass query parameters in an 
object hash. This method transforms the object back into a query string. I use
it in logger.


#### modules/jquery2axios.js, modules/axios2jquery.js

Helper methods that transform config objects. 


### modules/mocks.js

This is where the magic happens!

Here's our data:

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

If you have an endpoint (`/columbus/ships`) that returns the list, you can mock
it like so:

      let mock = new AxiosMockAdapter(axios);
      mock.onGet('/columbus/ships').reply(ships); 
      
This will intercept the axios request, and return the ship list in a resolved 
promise. But... it will not log the intercept, mockjax-style. To do that,
we wrap the reply in a handler function:

    function allShips(config) {
      log(config);
      return new Promise(function(resolve, reject) {
        resolve([200, ships]);
      });
    }
    
Note that the function gets the axios config object, so you can inspect it and 
and respond accordingly. Here, we just send it along to the logger. We'll look 
at a more interesting case in a moment.

The other thing of note is that you must provide your own promise if you use a
handler function for the mock. 

What if you have another endpoint that fetches a single ship by id? Example:

    /columbus/ship?id=2
    
If you are familiar with mockjax, you know that it permits you to use pattern-
matching expressions in the path, varying output accordingly. Unfortunately, 
axios-mock-adaptor does not support that. Instead, you handle it in a custom 
function:

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

In axios terms, `/columbus/ship?id=2` becomes a config object:

    {url:'/columbus/ship', params:{id:2}}
    
The handling function gets that config object, so it can inspect the params. On
the backend, the id might be passed to a database query. But for mock-purposes,
we'll use the id to fish the boat out of the mock data array.

Again, we take advantage of the handler function to log the intercept. And we
must again create a promise to return.
    
After setting up our mock data, and our handler functions, we install the mocks
themselves:

    // mock paths
    if (config.useMocks) {
      mock.onGet('/columbus/ships').reply(allShips);
      mock.onGet('/columbus/ship').reply(aShip);
    }

If we have set the config to true, we will apply the mocks. Otherwise, calls 
will pass through to axios. This enables us to use the same code for both dev
and deploy. Jus the wiggle the config setting accordingly.


