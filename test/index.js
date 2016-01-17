var should = require('chai').should(),
	expect = require('chai').expect,
    rewire = require('rewire'),
    path = require("path"),
    mitto = rewire('../lib/index.js');

//Inject private functions
var findFile = mitto.__get__('_findFile'),
	loadMitto = mitto.__get__('_loadMitto'),
	validateMitto = mitto.__get__('_validateMitto'),
	validateConfig = mitto.__get__('_validateConfig');


describe('#findFile', function() {
  it('finds files that exist that end in .json and loads them', function() {
    findFile('package.json').should.not.equal(null);
  });

  it('finds files in JSON format that dont end in .json, and loads them', function() {
    findFile('.mitto').should.not.equal(null);
  });
});


describe('#loadMitto', function() {
  it('finds .mitto file if it exists and loads it', function() {
    loadMitto().should.not.equal(null);
  });
});

describe('#validateMitto', function() {
  it('returns mittoObject if .mitto is in a valid format', function() {
  	var mittoObject = loadMitto();
    validateMitto(mittoObject).should.equal(mittoObject);
  });

  it('throws an error if .mitto is in an incorrect format', function() {
  	var mittoObject = {
  		haha: "what",
  		thisObject: "isWrong"
  	};
    (function(){validateMitto(mittoObject)}).should.throw(Error);
  });

  it('returns null if given null', function() {
    expect(validateMitto(null)).to.equal(null);
  });
});


describe('#validateConfig', function() {
  it('returns configObject if it meets .mitto requirements', function() {
  	var mittoObject = loadMitto();
  	var configObject = findFile('package.json');
    validateConfig(configObject, mittoObject).should.equal(configObject);
  });

  it('throws error if configObject does not meet .mitto requirements', function() {
  	var mittoObject = loadMitto();
  	var configObject = {
  		haha: "what",
  		thisObject: "isWrong"
  	};
    (function(){validateConfig(configObject, mittoObject)}).should.throw(Error);
  });

   it('returns configObject if theres no .mitto', function() {
  	var configObject = findFile('package.json');
    validateConfig(configObject, null).should.equal(configObject);
  });

  it('throws error if theres no configObject, and .mitto has a "required" config parameter', function() {
  	var mittoObject = loadMitto();
    (function(){validateConfig(null, mittoObject)}).should.throw(Error);
  });

  it('returns null if theres no configObject, and a .mitto with just "optional" parameters with no defaults', function() {
  	var configObject = findFile('package.json');
  	var mittoObject = {
  		name : "hoi",
  		optional : {
  			partyTime: {
  				type : 'boolean'
  			}
  		}
  	};
    expect(validateConfig(null, mittoObject)).to.equal(null);
  });

  it('returns empty object with added defaults if theres no configObject, and a .mitto with "optional" parameters with defaults', function() {
  	var mittoObject = {
  		hasDefault : true,
  		name : "hoi",
  		optional : {
  			partyTime: {
  				type : 'boolean',
  				default : true
  			}
  		}
  	};
    expect(validateConfig(null, mittoObject)).to.deep.equal({partyTime: true});
  });

  it('returns config object with added defaults if theres a .mitto with "optional" parameters with defaults', function() {
  	var configObject = findFile('package.json');
  	var mittoObject = {
  		hasDefault : true,
  		name : "hoi",
  		optional : {
  			partyTime: {
  				type : 'boolean',
  				default : true
  			}
  		}
  	};
    expect(validateConfig(configObject, mittoObject).partyTime).to.equal(true);
  });

  it('returns null if theres no configObject, and no .mitto', function() {
  	var configObject = findFile('package.json');
    expect(validateConfig(null, null)).to.equal(null);
  });
});


describe('#loadConfig', function() {
  it('finds and returns configObject and validates it against .mitto if it exists', function() {
  	var configObject = findFile('package.json');
    mitto.loadConfig('package.json').should.equal(configObject);
  });
});


