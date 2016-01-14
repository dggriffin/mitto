var should = require('chai').should(),
    mitto = require('../lib/index'),
    find = mitto.find,
    path = require("path");

describe('#find', function() {
  it('finds configs that exist', function() {
    find('package.json', true).should.equal(process.cwd() + path.sep + "package.json");
  });

    it('returns empty strings for configs that do not exist', function() {
    find('packagess.json', true).should.equal('');
  });

  it('finds config when it matches .mitto template', function() {
    find('package.json').should.equal(process.cwd() + path.sep + "package.json");
  });

  it('throws error when config doesnt match .mitto template', function() {
    (function(){find('packagetest.json')}).should.throw(Error);
  });

});
