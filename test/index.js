var should = require('chai').should(),
    mitto = require('../lib/index'),
    find = mitto.find;

describe('#find', function() {
  it('finds config', function() {
    find('package.json').should.equal(process.cwd() + "/package.json");
  });

  it('converts config to object with require', function() {
    var file = require(find('package.json'));
    file.name.should.equal("mitto");
  });

  it('finds config that matches template', function() {
    var template = {
      name: "",
      version: "",
      description: "",
      main: "",
      scripts: "",
      repository: "",
      keywords: "",
      author: "",
      license: "",
      bugs: "",
      homepage: ""
    };

   find('package.json', template).should.equal(process.cwd() + "/package.json");

  });
});
