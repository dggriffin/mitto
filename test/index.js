var should = require('chai').should(),
    mitto = require('../lib/index'),
    path = require("path");

var filename = 'package.json';

describe('#loadConfig', function() {
  it('finds configs that exist', function() {
    mitto.loadConfig(filename).should.not.equal(null);
  });
});
