'use strict';

/**
 * Returns a query string (ie, name=value pairs, separated by ampersands, preceded by question mark)
 *
 * Ex:
 * constructQS({foo:'alpha', bar:'beta'}) -> '?foo=alpha&bar=beta'
 *
 * @param {object} params hash of query parameters
 * @returns {string}
 */
module.exports = function(params) {
  params = params || {};
  let qs = '';
  let props = Object.keys(params);

  if (props.length) {
    qs = '?' + props.map(function(prop){
        return prop + '=' + params[prop];
      }).join('&');
  }

  return qs;
};
