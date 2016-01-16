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
 * Applies .mitto constraints if your package has a .mitto package present
 * @return {json converted to Object}
 */
function loadConfig(filename) {
  //Does our consumer have a valid .mitto?
  var mittoObject = _loadMitto();
  var configObject = _findFile(filename);

  return _validateConfig(configObject, mittoObject);
};

/**
  * PRIVATE HELPER FUNCTIONS
  */

//Find a "require" a JSON configuration given the filename
var _findFile = function _findFile(filename) {
  var cwd = process.cwd();
  var parts = cwd.split(_path2.default.sep);
  do {
    var loc = parts.join(_path2.default.sep);
    if (!loc) break;

    var file = _path2.default.join(loc, filename);
    if (_fs2.default.existsSync(file)) {
      var fileObj = undefined;
      try {
        fileObj = require(file);
      } catch (e) {
        fileObj = _loadJSON(file);
      }
      return fileObj;
    }

    parts.pop();
  } while (parts.length);

  return null;
};

//Find package's .mitto config (if it exists), load it, and then validate it
var _loadMitto = function _loadMitto() {
  var mittoObject = _findFile(MITTO_CONFIG);
  if (mittoObject) {
    return _validateMitto(mittoObject);
  }
  return null;
};

//Validate .mitto object handed off to function to ensure it is syntatical correct
var _validateMitto = function _validateMitto(mittoObject) {

  if (!mittoObject.hasOwnProperty("name")) {
    throw new Error("\"name\" property is missing from your .mitto and is required.");
  }

  if (mittoObject.hasOwnProperty("required")) {
    for (var key in mittoObject.required) {
      if (mittoObject.required[key].hasOwnProperty("type")) {
        if (DATA_TYPES.indexOf(mittoObject.required[key].type) === -1) {
          throw new Error(mittoObject.required[key].type + " is not a valid data type. Expected: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", or \"function\"");
        }
      } else {
        throw new Error("\"type\" property is missing from your .mitto's required parameter \"" + key + "\"");
      }

      if (mittoObject.required[key].hasOwnProperty("description") && typeof mittoObject.required[key].description !== "string") {
        throw new Error("\"description\" property of your .mitto's required parameter " + key + " must be of type \"string\"");
      }
    }
  }

  if (mittoObject.hasOwnProperty("optional")) {
    for (var key in mittoObject.optional) {
      if (mittoObject.optional[key].hasOwnProperty("type")) {
        if (DATA_TYPES.indexOf(mittoObject.optional[key].type) === -1) {
          throw new Error(mittoObject.optional[key].type + " is not a valid data type. Expected: \"undefined\", \"object\", \"boolean\", \"number\", \"string\", \"symbol\", or \"function\"");
        }
      } else {
        throw new Error("\"type\" property is missing from your .mitto's optional parameter " + key);
      }

      if (mittoObject.optional[key].hasOwnProperty("description") && typeof mittoObject.optional[key].description !== "string") {
        throw new Error("\"description\" property of your .mitto's optional parameter " + key + " must be of type \"string\"");
      }

      if (key.hasOwnProperty("default") && _typeof(mittoObject.optional[key].default) !== mittoObject.optional[key].type) {
        throw new Error("\"default\" property of your .mitto's optional parameter " + key + " must be a " + mittoObject.optional[key].type + ", as specified by \"type\"");
      }
    }
  }

  return mittoObject;
};

//Validate the consuming user's present config to ensure it meets the product producer's .mitto syntatical specifications
var _validateConfig = function _validateConfig(configObject, mittoObject) {
  var packageObject = _findFile('package.json');
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

//Convert file to JSON (used if file doesn't end in .json)
var _loadJSON = function _loadJSON(file) {
  try {
    var data = _fs2.default.readFileSync(file);
  } catch (e) {
    throw new Error(file + " expected to be in JSON format");
  }
  return JSON.parse(data);
};