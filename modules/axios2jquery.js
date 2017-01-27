'use strict';

/**
 * Transform an axios ajax config object to equivalent jquery object.
 *
 * @param {object} obj
 * @returns {object}
 */
module.exports = function(obj) {
  obj.responseType = obj.responseType || 'json';
  obj.method = obj.method || 'GET';
  obj.method = obj.method.toUpperCase();
  if (obj.params) {
    obj.data = Object.assign({}, obj.params);
    delete obj.params;
  }

  return obj
};
