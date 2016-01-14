"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findConfig = findConfig;
exports.findMittoConfig = findMittoConfig;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MITTO_CONFIG = '.mitto';

/**
 * Find JSON configuration given a filename
 *
 * @return {String} -- the filepath used fort require/import
 */
function findConfig(filename) {
  var cwd = process.cwd();
  var parts = cwd.split(_path2.default.sep);
  do {
    var loc = parts.join(_path2.default.sep);
    if (!loc) break;

    var file = _path2.default.join(loc, filename);
    if (_fs2.default.existsSync(file)) {
      return file;
    }

    parts.pop();
  } while (parts.length);

  return "";
};

/**
 * Find JSON configuration given .mitto configuration
 *
 * @return {String} -- the filepath used for require/import
 */

function findMittoConfig() {
  var mittoPath = findConfig(MITTO_CONFIG);
  var mittoObj = loadJSON(mittoPath);
  var packageObj = require(findConfig('package.json'));

  var configPath = findConfig(mittoObj.name);
  if (!configPath && Object.keys(mittoObj.required).length) {
    throw new Error(mittoObj.name + " configuration file not found, and is required by " + packageObj.name);
  } else if (!configPath) {
    return "";
  }

  var configObj = require(configPath);

  for (var key in mittoObj.required) {
    if (!configObj.hasOwnProperty(key)) {
      throw new Error("Required property " + key + " not found in " + mittoObj.name);
    } else if (_typeof(configObj[key]) !== _typeof(mittoObj.required[key])) {
      throw new Error("Required property " + key + " expected to be of type " + _typeof(configObj[key]));
    }
  }

  for (var key in mittoObj.optional) {
    if (_typeof(configObj[key]) !== _typeof(mittoObj.optional[key])) {
      throw new Error("Optional property " + key + " expected to be of type " + _typeof(configObj[key]));
    }
  }

  return configPath;
};

var loadJSON = function loadJSON(file) {
  var data = _fs2.default.readFileSync(file);
  return JSON.parse(data);
};