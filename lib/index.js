"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _template = undefined;
var _filename = undefined;
/**
 * Find JSON configuration given a filename and config template
 *
 * @param  {String} filename
 * @param  {bool} ignoreMittoTemplate
 * @return {String}
 */
function find(filename) {
  var ignoreMittoTemplate = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  _filename = filename;
  var cwd = process.cwd();
  var parts = cwd.split(_path2.default.sep);
  var mittoTemplate = undefined;

  //Check for explicit .mitto template, if not, oh well.
  if (!ignoreMittoTemplate) {
    mittoTemplate = find('.mitto', true);
  }

  do {
    var loc = parts.join(_path2.default.sep);
    if (!loc) break;

    var file = _path2.default.join(loc, filename);
    if (_fs2.default.existsSync(file) && (!mittoTemplate || _matchMittoTemplate(file, mittoTemplate))) {
      return file;
    }

    parts.pop();
  } while (parts.length);

  return "";
};

var _matchMittoTemplate = function _matchMittoTemplate(configPath, templatePath) {
  var config = require(configPath);
  var mittoTemplate = loadJSON(templatePath);

  for (var key in mittoTemplate.required) {
    if (!config.hasOwnProperty(key)) {
      throw new Error("Required property " + key + " not found in " + _filename);
    } else if (_typeof(config[key]) !== _typeof(mittoTemplate.required[key])) {
      throw new Error("Required property " + key + " expected to be of type " + _typeof(config[key]));
    }
  }

  for (var key in mittoTemplate.optional) {
    if (_typeof(config[key]) !== _typeof(mittoTemplate.optional[key])) {
      throw new Error("Optional property " + key + " expected to be of type " + _typeof(config[key]));
    }
  }
  return true;
};

var loadJSON = function loadJSON(file) {
  var data = _fs2.default.readFileSync(file);
  return JSON.parse(data);
};