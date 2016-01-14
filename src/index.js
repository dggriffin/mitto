import path from "path";
import fs from "fs";

let template;
/**
 * Find JSON configuration given a filename and config template
 *
 * @param  {String} filename
 * @param  {obj} template *Optional*
 * @return {String}
 */
export function find(filename, template) {
    let cwd = process.cwd();
    let parts = cwd.split(path.sep);

    do {
      let loc = parts.join(path.sep);
      if (!loc) break;

      let file = path.join(loc, filename);
      if (fs.existsSync(file) && (!template || _matchTemplate(file, template))) {
        return file;
      }

      parts.pop();
    } while (parts.length);

    return "";
};

let _matchTemplate = (configpath, template) => {
  let config = require(configpath);
  for (let key in template) {
    if (!config.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}