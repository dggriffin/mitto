import path from "path";
import fs from "fs";

const MITTO_CONFIG = '.mitto';

/**
 * Find JSON configuration given a filename
 *
 * @return {String} -- the filepath used fort require/import
 */
export function findConfig(filename) {
    let cwd = process.cwd();
    let parts = cwd.split(path.sep);
    do {
      let loc = parts.join(path.sep);
      if (!loc) break;

      let file = path.join(loc, filename);
      if (fs.existsSync(file)) {
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

export function findMittoConfig() {
  let mittoPath = findConfig(MITTO_CONFIG);
  let mittoObj = loadJSON(mittoPath);
  let packageObj = require(findConfig('package.json'));

  let configPath = findConfig(mittoObj.name);
  if (!configPath && Object.keys(mittoObj.required).length) {
    throw new Error(`${mittoObj.name} configuration file not found, and is required by ${packageObj.name}`);
  }
  else if (!configPath) {
    return "";
  }

  let configObj = require(configPath);

  for (let key in mittoObj.required) {
    if (!configObj.hasOwnProperty(key)) {
      throw new Error(`Required property ${key} not found in ${mittoObj.name}`);
    }
    else if (typeof configObj[key] !== typeof mittoObj.required[key]) {
      throw new Error(`Required property ${key} expected to be of type ${typeof configObj[key]}`);
    }
  }

  for (let key in mittoObj.optional) {
    if (typeof configObj[key] !== typeof mittoObj.optional[key]) {
      throw new Error(`Optional property ${key} expected to be of type ${typeof configObj[key]}`);
    }
  }

  return configPath;

};

let loadJSON = (file) => {
  let data = fs.readFileSync(file);
  return JSON.parse(data);
}