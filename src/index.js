import path from "path";
import fs from "fs";

let _template;
let _filename;
/**
 * Find JSON configuration given a filename and config template
 *
 * @param  {String} filename
 * @param  {bool} ignoreMittoTemplate
 * @return {String}
 */
export function find(filename, ignoreMittoTemplate = false) {
    _filename = filename;
    let cwd = process.cwd();
    let parts = cwd.split(path.sep);
    let mittoTemplate;

     //Check for explicit .mitto template, if not, oh well.
    if (!ignoreMittoTemplate) {
      mittoTemplate = find('.mitto', true);
    }
    
    do {
      let loc = parts.join(path.sep);
      if (!loc) break;

      let file = path.join(loc, filename);
      if (fs.existsSync(file) && (!mittoTemplate || _matchMittoTemplate(file, mittoTemplate))) {
        return file;
      }

      parts.pop();
    } while (parts.length);

    return "";
};

let _matchMittoTemplate = (configPath, templatePath) => {
  let config = require(configPath);
  let mittoTemplate = loadJSON(templatePath);

  for (let key in mittoTemplate.required) {
    if (!config.hasOwnProperty(key)) {
      throw new Error(`Required property ${key} not found in ${_filename}`);
    }
    else if (typeof config[key] !== typeof mittoTemplate.required[key]) {
      throw new Error(`Required property ${key} expected to be of type ${typeof config[key]}`);
    }
  }

  for (let key in mittoTemplate.optional) {
    if (typeof config[key] !== typeof mittoTemplate.optional[key]) {
      throw new Error(`Optional property ${key} expected to be of type ${typeof config[key]}`);
    }
  }
  return true;
};

let loadJSON = (file) => {
  let data = fs.readFileSync(file);
  return JSON.parse(data);
}