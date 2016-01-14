mitto <a href="https://travis-ci.org/dggriffin/mitto"><img alt="Travis Status" src="https://travis-ci.org/dggriffin/mitto.svg?branch=master"></a>
=========

A small library that lets you search for and specify configurations that should be present in other projects when your package is used.

## Installation

	npm install mitto --save

## Usage

	var mitto = require('mitto')
	find = mitto.find;

	var myconfig = find('config_i_need.json');

	if (myconfig) {
		myconfig = require(myconfig);
		//DO STUFF
	}
	else {
		//YELL AT THE USER
	}

	//You can even specify properties you are expecting with a template

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

	var packagejson = find('package.json', template);

	if (packagejson) {
		packagejson = require(packagejson);
		//DO STUFF
	}
	else {
		//YELL AT THE USER
	}

## Tests

	npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.0 Initial release
