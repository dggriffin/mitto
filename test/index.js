var should = require('chai').should(),
    mitto = require('../lib/index'),
    findConfig = mitto.findConfig,
    findMittoConfig = mitto.findMittoConfig,
    path = require("path");

var filename = 'package.json';

describe('#find', function() {
  it('finds configs that exist', function() {
    findConfig(filename).should.equal(process.cwd() + path.sep + filename);
  });

    it('returns empty strings for configs that do not exist', function() {
    findConfig('packagess.json').should.equal('');
  });

  it('finds config when it matches .mitto template', function() {
    findMittoConfig(filename).should.equal(process.cwd() + path.sep + filename);
  });

});
