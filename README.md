<!-- TITLE/ -->

<h1>Caterpillar</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-githubworkflow"><a href="https://github.com/bevry/caterpillar/actions?query=workflow%3Abevry" title="View the status of this project's GitHub Workflow: bevry"><img src="https://github.com/bevry/caterpillar/workflows/bevry/badge.svg" alt="Status of the GitHub Workflow: bevry" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/caterpillar" title="View this project on NPM"><img src="https://img.shields.io/npm/v/caterpillar.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/caterpillar" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/caterpillar.svg" alt="NPM downloads" /></a></span>
<br class="badge-separator" />
<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
<br class="badge-separator" />
<span class="badge-discord"><a href="https://discord.gg/nQuXddV7VP" title="Join this project's community on Discord"><img src="https://img.shields.io/discord/1147436445783560193?logo=discord&amp;label=discord" alt="Discord server badge" /></a></span>
<span class="badge-twitch"><a href="https://www.twitch.tv/balupton" title="Join this project's community on Twitch"><img src="https://img.shields.io/twitch/status/balupton?logo=twitch" alt="Twitch community badge" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Caterpillar is the ultimate logging system for Deno, Node.js, and Web Browsers. Log levels are implemented to the RFC standard. Log entries can be filtered and piped to various streams, including coloured output to the terminal, the browser's console, and debug files. You can even write your own transforms.

<!-- /DESCRIPTION -->


## Usage

[Complete API Documentation.](http://master.caterpillar.bevry.surge.sh/docs/)

### Examples

-   [Deno Example](https://repl.it/@balupton/caterpillar-deno)
-   [Node.js Example](https://repl.it/@balupton/caterpillar-node)
-   [Web Browser Example](https://repl.it/@balupton/caterpillar-browser)
-   [Writing a Custom Transform](https://repl.it/@balupton/caterpillar-custom-transform)

### Overview

The RFC Log Levels are provided by the [`rfc-log-levels` package](https://github.com/bevry/rfc-log-levels) which follows [RFC 3164 - The BSD Syslog Protocol](http://www.faqs.org/rfcs/rfc3164.html).

[Log Entries](http://master.caterpillar.bevry.surge.sh/docs/interfaces/logentry.html) that are within the [lineLevel](http://master.caterpillar.bevry.surge.sh/docs/classes/logger.html#linelevel) range, will have their line information fetched using the [`get-current-line` package](https://github.com/bevry/get-current-line).

The [`Logger`](http://master.caterpillar.bevry.surge.sh/docs/classes/logger.html) is what you write your log messages to, which you then pipe to destinations and transforms.

The [`Filter` transport](http://master.caterpillar.bevry.surge.sh/docs/classes/filter.html) is used to filter out log levels that we do not want to pass onto the next destination.

The [`Human` transport](http://master.caterpillar.bevry.surge.sh/docs/classes/human.html) is used to convert the Log Entries into a human readable and colourful output.

The [`Browser` transport](https://github.com/bevry/caterpillar/blob/master/source/transforms/browser.ts) is used to send the human output, including colours, to the Web Browser console.

The [`Transform`](http://master.caterpillar.bevry.surge.sh/docs/classes/transform.html) is used to write your own transforms, and is what all the others are based from.

### Node.js Guide

To get started for Node.js, setup a new Node.js project for this guide and install Caterpillar.

```bash
mkdir caterpillar-guide
cd caterpillar-guide
npm init
npm install --save caterpillar
touch index.js
```

Then edit our `index.js` file with the following, that will output all the log messages in JSON format to stdout, and can be run via `node index.js`:

```javascript
const { Logger } = require('caterpillar')
const logger = new Logger()

logger.pipe(process.stdout)

logger.log('warn', 'this is a warning, which is level', 4)
logger.warn('this is a warning, which is level', 4)
logger.log('debug', 'this is a debug message, which is level', 7)
logger.warn('this is a debug message, which is level', 7)
```

Outputting in JSON format is not a nice experience, instead we can do better by using the [`Human` transport](http://master.caterpillar.bevry.surge.sh/docs/classes/human.html) such that it is human readable.

```javascript
const { Logger, Human } = require('caterpillar')
const logger = new Logger()

logger.pipe(new Human()).pipe(process.stdout)

logger.log('warn', 'this is a warning, which is level', 4)
logger.warn('this is a warning, which is level', 4)
logger.log('debug', 'this is a debug message, which is level', 7)
logger.warn('this is a debug message, which is level', 7)
```

However, perhaps we want to still store the JSON format for querying later. We can pipe the human format to stdout as before, but we can pipe the raw output to a debug file.

```javascript
const { Logger, Human } = require('caterpillar')
const logger = new Logger()

const { createWriteStream } = require('fs')
logger.pipe(createWriteStream('./debug.log'))

logger.pipe(new Human()).pipe(process.stdout)

logger.log('warn', 'this is a warning, which is level', 4)
logger.warn('this is a warning, which is level', 4)
logger.log('debug', 'this is a debug message, which is level', 7)
logger.warn('this is a debug message, which is level', 7)
```

Now let's stay for some reason, we want to capitalise all the log messages that are warning levels and higher, we can do this by making our own transport by extending the [`Transform`](http://master.caterpillar.bevry.surge.sh/docs/classes/transform.html).

```javascript
const { Logger, Transform, Human } = require('caterpillar')
const logger = new Logger()

const { createWriteStream } = require('fs')
logger.pipe(createWriteStream('./debug.log'))

class Uppercase extends Transform {
    format(entry) {
        if (entry.levelNumber <= 4) {
            entry.args.forEach(function (value, index) {
                if (typeof value === 'string') {
                    entry.args[index] = value.toUpperCase()
                }
            })
        }
        return entry
    }
}

logger.pipe(new Uppercase()).pipe(new Human()).pipe(process.stdout)

logger.log('warn', 'this is a warning, which is level', 4)
logger.warn('this is a warning, which is level', 4)
logger.log('debug', 'this is a debug message, which is level', 7)
logger.warn('this is a debug message, which is level', 7)
```

Futhermore, the user probably doesn't need to see debug messages, even though they are useful for debugging. We can filter out the debug messages for the user, but maintain them for the `debug.log` file by applying the [`Filter` transport](http://master.caterpillar.bevry.surge.sh/docs/classes/filter.html) to the pipe that goes to stdout.

```javascript
const { Logger, Transform, Filter, Human } = require('caterpillar')
const logger = new Logger()

const { createWriteStream } = require('fs')
logger.pipe(createWriteStream('./debug.log'))

class Uppercase extends Transform {
    format(entry) {
        if (entry.levelNumber <= 4) {
            entry.args.forEach(function (value, index) {
                if (typeof value === 'string') {
                    entry.args[index] = value.toUpperCase()
                }
            })
        }
        return entry
    }
}

logger
    .pipe(new Filter({ filterLevel: 5 }))
    .pipe(new Uppercase())
    .pipe(new Human())
    .pipe(process.stdout)

logger.log('warn', 'this is a warning, which is level', 4)
logger.warn('this is a warning, which is level', 4)
logger.log('debug', 'this is a debug message, which is level', 7)
logger.warn('this is a debug message, which is level', 7)
```

As fetching line information is computationally expensive process, for large applications for performance we probably only want to fetch the line information for messages that we actually show to the user. As such, we should make the [`filterLevel`](http://master.caterpillar.bevry.surge.sh/docs/classes/filter.html#filterlevel) and the [`lineLevel`](http://master.caterpillar.bevry.surge.sh/docs/classes/logger.html#linelevel) the same.

```javascript
const { Logger, Transform, Filter, Human } = require('caterpillar')
const level = 5
const logger = new Logger({ lineLevel: level })

const { createWriteStream } = require('fs')
logger.pipe(createWriteStream('./debug.log'))

class Uppercase extends Transform {
    format(entry) {
        if (entry.levelNumber <= 4) {
            entry.args.forEach(function (value, index) {
                if (typeof value === 'string') {
                    entry.args[index] = value.toUpperCase()
                }
            })
        }
        return entry
    }
}

logger
    .pipe(new Filter({ filterLevel: 5 }))
    .pipe(new Uppercase())
    .pipe(new Human())
    .pipe(process.stdout)

logger.log('warn', 'this is a warning, which is level', 4)
logger.warn('this is a warning, which is level', 4)
logger.log('debug', 'this is a debug message, which is level', 7)
logger.warn('this is a debug message, which is level', 7)
```

Finally, if we are using Caterpillar in web browser environments, instead of Node.js, instead of doing:

```javascript
const { Logger, Transform, Filter, Human } = require('caterpillar')
// ...
logger.pipe(new Human()).pipe(process.stdout)
// ...
```

We would pipe to the Browser transform instead of to stdout.

```javascript
const { Logger, Transform, Filter, Human, Browser } = require('caterpillar')
// ...
logger.pipe(new Human()).pipe(new Browser())
// ...
```

With this, you now have enough information to leverage the cross-platform power of Caterpillar for most purposes, and the power to write your own custom transforms which can be published as their own packages and shared.

<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<ul>
<li>Install: <code>npm install --save caterpillar</code></li>
<li>Import: <code>import * as pkg from ('caterpillar')</code></li>
<li>Require: <code>const pkg = require('caterpillar')</code></li>
</ul>

<a href="https://deno.land" title="Deno is a secure runtime for JavaScript and TypeScript, it is an alternative for Node.js"><h3>Deno</h3></a>

``` typescript
import * as pkg from 'https://unpkg.com/caterpillar@^7.0.0/edition-deno/index.ts'
```

<a href="https://www.skypack.dev" title="Skypack is a JavaScript Delivery Network for modern web apps"><h3>Skypack</h3></a>

``` html
<script type="module">
    import * as pkg from '//cdn.skypack.dev/caterpillar@^7.0.0'
</script>
```

<a href="https://unpkg.com" title="unpkg is a fast, global content delivery network for everything on npm"><h3>unpkg</h3></a>

``` html
<script type="module">
    import * as pkg from '//unpkg.com/caterpillar@^7.0.0'
</script>
```

<a href="https://jspm.io" title="Native ES Modules CDN"><h3>jspm</h3></a>

``` html
<script type="module">
    import * as pkg from '//dev.jspm.io/caterpillar@7.0.0'
</script>
```

<h3><a href="https://editions.bevry.me" title="Editions are the best way to produce and consume packages you care about.">Editions</a></h3>

<p>This package is published with the following editions:</p>

<ul><li><code>caterpillar</code> aliases <code>caterpillar/index.cjs</code> which uses the <a href="https://github.com/bevry/editions" title="You can use the Editions Autoloader to autoload the appropriate edition for your consumers environment">Editions Autoloader</a> to automatically select the correct edition for the consumer's environment</li>
<li><code>caterpillar/source/index.ts</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> source code with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>caterpillar/edition-browsers/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against ES2022 for web browsers with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>caterpillar/edition-es2022/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against ES2022 for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 14 || 16 || 18 || 20 || 21 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li>
<li><code>caterpillar/edition-es2019/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 8 || 10 || 12 || 14 || 16 || 18 || 20 || 21 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li>
<li><code>caterpillar/edition-es2016/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#7th_Edition_-_ECMAScript_2016" title="ECMAScript 2016">ES2016</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 6 || 8 || 10 || 12 || 14 || 16 || 18 || 20 || 21 with <a href="https://nodejs.org/dist/latest-v5.x/docs/api/modules.html" title="Node/CJS Modules">Require</a> for modules</li>
<li><code>caterpillar/edition-es2019-esm/index.js</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled against <a href="https://en.wikipedia.org/wiki/ECMAScript#10th_Edition_-_ECMAScript_2019" title="ECMAScript ES2019">ES2019</a> for <a href="https://nodejs.org" title="Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine">Node.js</a> 12 || 14 || 16 || 18 || 20 || 21 with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>caterpillar/edition-types/index.d.ts</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> compiled Types with <a href="https://babeljs.io/docs/learn-es2015/#modules" title="ECMAScript Modules">Import</a> for modules</li>
<li><code>caterpillar/edition-deno/index.ts</code> is <a href="https://www.typescriptlang.org/" title="TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. ">TypeScript</a> source code made to be compatible with <a href="https://deno.land" title="Deno is a secure runtime for JavaScript and TypeScript, it is an alternative to Node.js">Deno</a></li></ul>

<!-- /INSTALL -->


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

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

<h3>Contributors</h3>

These amazing people have contributed code to this project:

<ul><li><a href="https://balupton.com">Benjamin Lupton</a> — <a href="https://github.com/bevry/caterpillar/commits?author=balupton" title="View the GitHub contributions of Benjamin Lupton on repository bevry/caterpillar">view contributions</a></li>
<li><a href="https://github.com/thelfensdrfer">Tim Helfensdörfer</a> — <a href="https://github.com/bevry/caterpillar/commits?author=thelfensdrfer" title="View the GitHub contributions of Tim Helfensdörfer on repository bevry/caterpillar">view contributions</a></li>
<li><a href="https://github.com/t-visualappeal">t-visualappeal</a> — <a href="https://github.com/bevry/caterpillar/commits?author=t-visualappeal" title="View the GitHub contributions of t-visualappeal on repository bevry/caterpillar">view contributions</a></li></ul>

<a href="https://github.com/bevry/caterpillar/blob/master/CONTRIBUTING.md#files">Discover how you can contribute by heading on over to the <code>CONTRIBUTING.md</code> file.</a>

<!-- /BACKERS -->


<!-- LICENSE/ -->

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; 2012+ <a href="http://bevry.me">Bevry Pty Ltd</a></li>
<li>Copyright &copy; 2011 <a href="https://balupton.com">Benjamin Lupton</a></li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/Artistic-2.0.html">Artistic License 2.0</a></li></ul>

<!-- /LICENSE -->
