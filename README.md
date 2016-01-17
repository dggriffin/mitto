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
#### Using mitto as a simple file/config finder without a `.mitto` file
```javascript
	var mitto = require('mitto');

	var myConfig = mitto.loadConfig('config_i_need.json');

	if (myConfig) {
		//DO STUFF
	} else {
		//YELL AT USER AND CONFIGURE THINGS MYSELF
	}
```

#### Using mitto for type-checked configuration expression with a `.mitto` file
Create a `.mitto` config file in your root folder:
```javascript
{
	"name" : "name_of_the_config_file_you_expect_the_user_to_provide.json",
	"required" : {
		"areWeHavingFun" : {
			"type" : "boolean",   //valid types: "undefined", "object", "boolean", "number", "string", "symbol", "function"
			"description" : "boolean that represents if we're having fun" // **Optional**, you don't have to include "description"
		},
		"maximumBeerCount" : {
			"type" : "number"
		} 
	},
	"optional" : {
		"partyResponsibly" : {
			"type" : "boolean",
			"description" : "boolean indiciating if we should party responsibly",
			"default" : false // **Optional**, this controls the default value this is initialized to if the user doesn't provide this field, or doesn't have a configuration at all
		}
	}
}
```
The code we write will be the exact same, except anything we get from the user will be compared with your .mitto and type-checked:
```javascript
	var mitto = require('mitto');

	var myConfig = mitto.loadConfig('config_i_need.json');

	if (myConfig) {
		//DO STUFF
	} else {
		//CONFIGURE THINGS MYSELF
	}
```

#### Important Notes 
* If *DO* have a `.mitto` *WITH* `required` attributes, and the user *DOES NOT* have a configuration present, they will be thrown an error, stating they are missing a configuration of the name you specified
* If *DO* have a `.mitto` *WITH OUT* `required` attributes, and the user *DOES NOT* have a configuration present, they will not be thrown an error, and you will be returned either NULL or an object with your defaults
* If *DO* have a `.mitto` *WITH* `required` attributes, and the user *DOES* have a configuration present, they will be thrown an error if they are missing a required parameter, or have a parameter of an invalid type

## Tests

	npm test

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History
* 0.2.0 Switch from object-templating to .mitto templating, separate opinionated call from non-opiniated.
* 0.1.0 Initial release
