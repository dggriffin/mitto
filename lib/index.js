"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadConfig = loadConfig;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MITTO_CONFIG = '.mitto';
var DATA_TYPES = ["undefined", "object", "boolean", "number", "string", "symbol", "function"];

/**
 * Find JSON configuration given a filename
 *
 * @return {String} -- the filepath used fort require/import
 */
function loadConfig(filename) {
  //Does our consumer have a valid .mitto?
  var mittoObject = _loadMitto();
  var configObject = _findFile(filename);

  return _validateConfig(configObject, mittoObject);
};

var _findFile = function _findFile(filename) {
  var cwd = process.cwd();
  var parts = cwd.split(_path2.default.sep);
  do {
    var loc = parts.join(_path2.default.sep);
    if (!loc) break;

    var file = _path2.default.join(loc, filename);
    if (_fs2.default.existsSync(file)) {
      var fileObj = require(file);
      if ((typeof fileObj === "undefined" ? "undefined" : _typeof(fileObj)) !== "object") {
        fileObj = _loadJSON(fileObj);
      }
      return fileObj;
    }

    parts.pop();
  } while (parts.length);

  return null;
};

var _loadMitto = function _loadMitto() {
  var mittoObject = _findFile(MITTO_CONFIG);
  return mittoOjbect ? _validateMitto(mittoObject) : null;
};

var _validateMitto = function _validateMitto(mittoObject) {

  if (!mittoObject.hasOwnProperty("name")) {
    throw new Error("\"name\" property is missing from .mitto and is required.");
  }

  if (mittoObject.hasOwnProperty("required")) {
    for (var key in mittoObject.required) {
      if (key.hasOwnProperty("type")) {
        if (DATA_TYPES.indexOf(key.type) === -1) {
          throw new Error(key.type + " is not a valid data type. Expected: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", or \"function\"");
        }
      } else {
        throw new Error("\"type\" property is missing from .mitto's required parameter " + key);
      }

      if (key.hasOwnProperty("description") && typeof key.description !== "string") {
        throw new Error("\"description\" property of .mitto's required parameter " + key + " must be of type \"string\"");
      }
    }
  }

  if (mittoObject.hasOwnProperty("optional")) {
    for (var key in mittoObject.optional) {
      if (key.hasOwnProperty("type")) {
        if (DATA_TYPES.indexOf(key.type) === -1) {
          throw new Error(key.type + " is not a valid data type. Expected: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", or \"function\"");
        }
      } else {
        throw new Error("\"type\" property is missing from .mitto's optional parameter " + key);
      }

      if (key.hasOwnProperty("description") && typeof key.description !== "string") {
        throw new Error("\"description\" property of .mitto's optional parameter " + key + " must be of type \"string\"");
      }

      if (key.hasOwnProperty("default") && _typeof(key.default) !== key.type) {
        throw new Error("\"default\" property of .mitto's optional parameter " + key + " must be a " + key.type + ", as specified by \"type\"");
      }
    }
  }

  return mittoObject;
};

var _validateConfig = function _validateConfig(configObject, mittoObject) {
  var packageObject = require(_findFile('package.json'));
  if (!mittoObject) {
    return configObject;
  }

  if (!configObject && Object.keys(mittoObject.required).length) {
    throw new Error(mittoObject.name + " configuration file not found, and is required by " + packageObject.name);
  } else if (!configObject) {
    return configObject;
  }

  for (var key in mittoObject.required) {
    if (!configObject.hasOwnProperty(key)) {
      throw new Error("Required property " + key + " not found in " + mittoObject.name);
    } else if (_typeof(configObject[key]) !== mittoObject.required[key].type) {
      throw new Error("Required property " + key + " expected to be of type " + mittoObject.required[key].type);
    }
  }

  for (var key in mittoObject.optional) {
    if (_typeof(configObject[key]) !== mittoObject.optional[key].type) {
      throw new Error("Optional property " + key + " expected to be of type " + mittoObject.required[key].type);
    }
  }

  return configObject;
};

var _loadJSON = function _loadJSON(file) {
  try {
    var _data = _fs2.default.readFileSync(file);
  } catch (e) {
    throw new Error(file + " expected to be in JSON format");
  }
  return JSON.parse(data);
};