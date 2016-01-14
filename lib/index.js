"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var template = undefined;
/**
 * Escape special characters in the given string of html.
 *
 * @param  {String} html
 * @return {String}
 */
function find(filename, template) {
  var cwd = process.cwd();
  var parts = cwd.split(_path2.default.sep);

  do {
    var loc = parts.join(_path2.default.sep);
    if (!loc) break;

    var file = _path2.default.join(loc, filename);
    if (_fs2.default.existsSync(file) && (!template || _matchTemplate(file, template))) {
      return file;
    }

    parts.pop();
  } while (parts.length);

  return false;
};

var _matchTemplate = function _matchTemplate(configpath, template) {
  var config = require(configpath);
  for (var key in template) {
    if (!config.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};