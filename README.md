<!-- TITLE/ -->

<h1>Caterpillar</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-travisci"><a href="http://travis-ci.org/bevry/caterpillar" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/bevry/caterpillar/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/caterpillar" title="View this project on NPM"><img src="https://img.shields.io/npm/v/caterpillar.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/caterpillar" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/caterpillar.svg" alt="NPM downloads" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/bevry/caterpillar" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/bevry/caterpillar.svg" alt="Dependency Status" /></a></span>
<span class="badge-daviddmdev"><a href="https://david-dm.org/bevry/caterpillar#info=devDependencies" title="View the status of this project's development dependencies on DavidDM"><img src="https://img.shields.io/david/dev/bevry/caterpillar.svg" alt="Dev Dependency Status" /></a></span>
<br class="badge-separator" />
<span class="badge-slackin"><a href="https://slack.bevry.me" title="Join this project's slack community"><img src="https://slack.bevry.me/badge.svg" alt="Slack community badge" /></a></span>
<span class="badge-patreon"><a href="http://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<!-- /BADGES -->


Caterpillar is the ultimate logging system for Node.js, based on [transform streams](http://nodejs.org/api/stream.html#stream_class_stream_transform) you can log to it and pipe the output off to different locations, including [some pre-made ones](http://npmjs.org/keyword/caterpillar-transform). Caterpillar also supports log levels according to the [RFC standard](http://www.faqs.org/rfcs/rfc3164.html), as well as line, method, and file fetching for messages. You can even use it in web browsers with the [Browser Transform](https://github.com/bevry/caterpillar-browser).


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>NPM</h3></a><ul>
<li>Install: <code>npm install --save caterpillar</code></li>
<li>Use: <code>require('caterpillar')</code></li></ul>

<a href="http://browserify.org" title="Browserify lets you require('modules') in the browser by bundling up all of your dependencies"><h3>Browserify</h3></a><ul>
<li>Install: <code>npm install --save caterpillar</code></li>
<li>Use: <code>require('caterpillar')</code></li>
<li>CDN URL: <code>//wzrd.in/bundle/caterpillar@2.0.9</code></li></ul>

<a href="http://enderjs.com" title="Ender is a full featured package manager for your browser"><h3>Ender</h3></a><ul>
<li>Install: <code>ender add caterpillar</code></li>
<li>Use: <code>require('caterpillar')</code></li></ul>

<!-- /INSTALL -->


## Usage

### Example with the [Filter](https://github.com/bevry/caterpillar-filter) and [Human](https://github.com/bevry/caterpillar-human) transforms

``` javascript
// Import
var level   = process.argv.indexOf('-d') === -1 ? 6 : 7;
var logger  = require('caterpillar').createLogger({level:level});
var filter  = require('caterpillar-filter').createFilter();
var human   = require('caterpillar-human').createHuman();

// Where to output?
if ( process.title === 'browser' ) {
	// Include the browser compatibility layer
	var browser = require('caterpillar-browser').createBrowser();

	// Pipe to filter to human to browser
	logger.pipe(filter).pipe(human).pipe(browser);
}
else {
	// Pipe to filter to human to stdout
	logger.pipe(filter).pipe(human).pipe(process.stdout);

	// If we are debugging, then write the original logger data to debug.log
	if ( level === 7 ) {
		logger.pipe(require('fs').createWriteStream('./debug.log'));
	}
}

// Log messages
logger.log('emergency', 'this is level 0');
logger.log('emerg', 'this is level 0');
logger.log('alert', 'this is level 1');
logger.log('critical', 'this is level 2');
logger.log('crit', 'this is level 2');
logger.log('error', 'this is level 3');
logger.log('err', 'this is level 3');
logger.log('warning', 'this is level 4');
logger.log('warn', 'this is level 4');
logger.log('notice', 'this is level 5');
logger.log('note', 'this is level 5');
logger.log('info', 'this is level 6');
logger.log('default', 'this is level 6');
logger.log('debug', 'this is level 7');
logger.log('this is level 6, the default level');
logger.log('you','can','also','use','as','many','arguments','as','you','want',1,[2,3],{four:5});
```

Result with log level 6 (info):

<img src="http://d.pr/i/DBFD+"/>


Result with log level 7 (debug):

<img src="http://d.pr/i/IZ8I+"/>


Result with log level 7 (debug) in the browser with the [Browser Transform](https://github.com/bevry/caterpillar-browser)

<img src="http://d.pr/i/SK8d+">


### Transform API, extends [stream.Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform)

``` javascript
new (require('caterpillar').Transform)(config)
```

- Methods
	- `constructor(config?)` create our new instance with the config, config is optional
	- `pipe(child)` pipe our stream to the child, also sync our config to it
	- `setConfig(config)` set the configuration and emit the `config` event
	- `getConfig()` get the configuration
	- `format(entry)` format the caterpillar logger entry
- Configuration
	- none by default
- Events
	- `config(config)` emitted once our configuration has updated


### Logger API, extends Transform API

``` javascript
new (require('caterpillar').Logger)(config)
```

- Methods
	- `constructor(config?)` create our new instance with the config, config is optional
	- `log(args...)` write a log message, the first argument is suppose to be the level (will use the default level if it isn't)
	- `format(level, args...)` create a log entry ready for writing to the logger stream, output is as follows:

		``` javascript
		{
			"args": ["this is emergency and is level 0"],
			"date": "2013-04-25T10:18:25.722Z",
			"levelNumber": 0,
			"levelName": "emergency",
			"line": "59",
			"method": "Task.fn",
			"file": "/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"
		}
		```

	- `getLevelNumber(name)` get the level number for the level name
	- `getLevelName(number)` get the level name for the level number
	- `getLevelInfo(nameOrNumber)` get the level name and number for either a level name or number
	- `getLineInfo()` get the file, method, and line that the `log` method was called on

- Configuration
	- `lineOffset` the amount of lines to offset when doing our line detection, useful for wrappers, defaults to `0`
	- `levels` the level names and their associated number, also includes `default` for when no level was specified, defaults to:
	
		``` javascript
		{
			emergency: 0,
			alert: 1,
			critical: 2,
			error: 3,
			warning: 4,
			notice: 5,
			info: 6,
			debug: 7,

			emerg: 0,
			crit: 2,
			err: 3,
			warn: 4,
			note: 5,

			default: 6
		}
		```

- Events
	- only those inherited



<!-- HISTORY/ -->

<h2>History</h2>

<a href="https://github.com/bevry/caterpillar/blob/master/HISTORY.md#files">Discover the release history by heading on over to the <code>HISTORY.md</code> file.</a>

<!-- /HISTORY -->


<!-- BACKERS/ -->

<h2>Backers</h2>

<h3>Maintainers</h3>

These amazing people are maintaining this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/caterpillar/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/caterpillar">view contributions</a></li></ul>

<h3>Sponsors</h3>

No sponsors yet! Will you be the first?

<span class="badge-patreon"><a href="http://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-gratipay"><a href="https://www.gratipay.com/bevry" title="Donate weekly to this project using Gratipay"><img src="https://img.shields.io/badge/gratipay-donate-yellow.svg" alt="Gratipay donate button" /></a></span>
<span class="badge-flattr"><a href="https://flattr.com/profile/balupton" title="Donate to this project using Flattr"><img src="https://img.shields.io/badge/flattr-donate-yellow.svg" alt="Flattr donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<span class="badge-bitcoin"><a href="https://bevry.me/bitcoin" title="Donate once-off to this project using Bitcoin"><img src="https://img.shields.io/badge/bitcoin-donate-yellow.svg" alt="Bitcoin donate button" /></a></span>
<span class="badge-wishlist"><a href="https://bevry.me/wishlist" title="Buy an item on our wishlist for us"><img src="https://img.shields.io/badge/wishlist-donate-yellow.svg" alt="Wishlist browse button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/caterpillar/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/caterpillar">view contributions</a></li>
<li><a href="https://github.com/t-visualappeal">t-visualappeal</a> — <a href="https://github.com/bevry/caterpillar/commits?author=t-visualappeal" title="View the GitHub contributions of t-visualappeal on repository bevry/caterpillar">view contributions</a></li>
<li><a href="http://thelfensdrfer.de">Tim Helfensdörfer</a> — <a href="https://github.com/bevry/caterpillar/commits?author=thelfensdrfer" title="View the GitHub contributions of Tim Helfensdörfer on repository bevry/caterpillar">view contributions</a></li></ul>

<a href="https://github.com/bevry/caterpillar/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2012+ <a href="http://bevry.me">Bevry Pty Ltd</a></li>
<li>Copyright &copy; 2011 <a href="https://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->
