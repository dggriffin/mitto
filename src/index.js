import path from "path";
import fs from "fs";

const MITTO_CONFIG = '.mitto';
const DATA_TYPES = ["undefined", "object", "boolean", "number", "string", "symbol", "function"];

/**
 * Find JSON configuration given a filename
 *
 * @return {String} -- the filepath used fort require/import
 */
export function loadConfig(filename) {
  //Does our consumer have a valid .mitto?
  let mittoObject = _loadMitto();
  let configObject = _findFile(filename);

  return _validateConfig(configObject, mittoObject);
};

let _findFile = (filename) => {
    let cwd = process.cwd();
    let parts = cwd.split(path.sep);
    do {
      let loc = parts.join(path.sep);
      if (!loc) break;

      let file = path.join(loc, filename);
      if (fs.existsSync(file)) {
        let fileObj = require(file);
        if(typeof fileObj !== "object") {
          fileObj = _loadJSON(fileObj);
        }
        return fileObj;
      }

      parts.pop();
    } while (parts.length);

    return null;
};

let _loadMitto = () => {
  let mittoObject = _findFile(MITTO_CONFIG);
  return mittoOjbect ? _validateMitto(mittoObject) : null;
};

let _validateMitto = (mittoObject) => {

  if (!mittoObject.hasOwnProperty("name")) {
     throw new Error(`"name" property is missing from .mitto and is required.`);
  }

  if (mittoObject.hasOwnProperty("required")) {
    for (let key in mittoObject.required) {
      if (key.hasOwnProperty("type")) {
        if (DATA_TYPES.indexOf(key.type) === -1) {
          throw new Error(`${key.type} is not a valid data type. Expected: "undefined", "object", "boolean", "number", "string", "symbol", or "function"`);
        }
      }
      else {
        throw new Error(`"type" property is missing from .mitto's required parameter ${key}`);
      }

      if (key.hasOwnProperty("description") && typeof key.description !== "string") {
        throw new Error(`"description" property of .mitto's required parameter ${key} must be of type "string"`);
      }
    }
  }

  if (mittoObject.hasOwnProperty("optional")) {
    for (let key in mittoObject.optional) {
      if (key.hasOwnProperty("type")) {
        if (DATA_TYPES.indexOf(key.type) === -1) {
          throw new Error(`${key.type} is not a valid data type. Expected: "undefined", "object", "boolean", "number", "string", "symbol", or "function"`);
        }
      }
      else {
        throw new Error(`"type" property is missing from .mitto's optional parameter ${key}`);
      }

      if (key.hasOwnProperty("description") && typeof key.description !== "string") {
        throw new Error(`"description" property of .mitto's optional parameter ${key} must be of type "string"`);
      }

      if (key.hasOwnProperty("default") && typeof key.default !== key.type) {
        throw new Error(`"default" property of .mitto's optional parameter ${key} must be a ${key.type}, as specified by "type"`);
      }
    }
  }

  return mittoObject;
};

let _validateConfig = (configObject, mittoObject) => {
  let packageObject = require(_findFile('package.json'));
  if(!mittoObject){
    return configObject;
  }

  if (!configObject && Object.keys(mittoObject.required).length) {
    throw new Error(`${mittoObject.name} configuration file not found, and is required by ${packageObject.name}`);
  }
  else if (!configObject) {
    return configObject;
  }

  for (let key in mittoObject.required) {
    if (!configObject.hasOwnProperty(key)) {
      throw new Error(`Required property ${key} not found in ${mittoObject.name}`);
    }
    else if (typeof configObject[key] !== mittoObject.required[key].type) {
      throw new Error(`Required property ${key} expected to be of type ${mittoObject.required[key].type}`);
    }
  }

  for (let key in mittoObject.optional) {
    if (typeof configObject[key] !== mittoObject.optional[key].type) {
      throw new Error(`Optional property ${key} expected to be of type ${mittoObject.required[key].type}`);
    }
  }

  return configObject;
};

let _loadJSON = (file) => {
  try {
    let data = fs.readFileSync(file);
  } catch (e) {
    throw new Error(`${file} expected to be in JSON format`);
  }
  return JSON.parse(data);
};
