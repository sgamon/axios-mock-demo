'use strict';

/**
 * Transform an axios ajax config object to equivalent jquery object.
 *
 * @param {object} obj
 * @returns {object}
 */
module.exports = function(obj) {
  obj.responseType = obj.responseType || 'text';
  obj.method = obj.method || 'get';
  obj.method = obj.method.toLowerCase();
  if (obj.data && (obj.method == 'get')) {
    obj.params = Object.assign({}, obj.data);
    delete obj.data;
  }

  return obj;
};
