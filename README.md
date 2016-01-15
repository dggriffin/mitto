#mitto 
<a href="https://www.npmjs.com/package/mitto"><img alt="npm version" src="https://img.shields.io/npm/v/mitto.svg"></a><a href="https://travis-ci.org/dggriffin/mitto"><img alt="Travis Status" src="https://travis-ci.org/dggriffin/mitto.svg?branch=master"></a><a href="https://david-dm.org/dggriffin/mitto#info=dependencies&view=table"><img alt="Travis Status" src="https://david-dm.org/dggriffin/mitto.svg"></a><a href="https://david-dm.org/dggriffin/mitto#info=devDependencies&view=table"><img alt="Travis Status" src="https://david-dm.org/dggriffin/mitto/dev-status.svg"></a>


**mitto** is a small library that helps package creators search the file directory of the application consuming them for their relevant config.

Package creators can even drop a `.mitto` file into their root folder and specify `required` and `optional` parameters with type-checking (including descriptive error messages for your package consumers if a required parameter is not present or of the wrong type).

##### Reasons to use mitto:
* Quick and painless to start writing your package with a user-provided config in mind
* `required` or `optional` parameter enforcement with type-checking for your configs
* Descriptive error messages for the user when something is misconfigured
* `.mitto` gives your package consumers a common area to see what configurations are available or expected of them

## Installation

	npm install mitto --save

## Usage
#### Using mitto as a simple file/config finder with `mitto.findConfig`
```javascript
	var mitto = require('mitto')
	findConfig = mitto.findConfig;

	var myConfigPath = findConfig('config_i_need.json');
	var myConfigObj;

	if (myConfigPath) {
		myConfigObj = require(myConfigPath);
		//DO STUFF
	} else {
		//YELL AT USER AND CONFIGURE THINGS MYSELF
	}
```

#### Using mitto for type-checked configuration expression with `mitto.findMittoConfig`
Create a `.mitto` config file in your root folder:
```javascript
{
	"name" : "name_of_the_config_file_you_expect_the_user_to_provide.json",
	"required" : {
		"name" : "",
		"version" : "",
		"description": "",
		"main": "",
		"scripts": {},
		"repository": {},
		"keywords": [],
		"author": "",
		"license": "",
		"bugs" : {},
		"homepage": ""
	},
	"optional" : {
		"devDependencies" : {}
	}
}
```
Then in code:
```javascript
	var mitto = require('mitto');
	findMittoConfig = mitto.findMittoConfig;

	var myConfigPath = findMittoConfig();
	var myConfigObj = require(myConfigPath);
	
	//DO STUFF...
```

#### Important Notes 
* Property names listed under `required` must be present and will be type-checked against what the user provides.

* Property names listed under `optional` need not be present, but if they are, they will be type-checked.

* If no property names are listed under `required`, the user will *not* be thrown an error when attempting to use your npm package.

## Tests

	npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
* 0.2.0 Switch from object-templating to .mitto templating, separate opinionated call from non-opiniated.
* 0.1.0 Initial release
