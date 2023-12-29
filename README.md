<!-- TITLE/ -->

# Caterpillar

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

## Install

### [npm](https://npmjs.com "npm is a package manager for javascript")

-   Install: `npm install --save caterpillar`
-   Import: `import * as pkg from ('caterpillar')`
-   Require: `const pkg = require('caterpillar')`

### [Deno](https://deno.land "Deno is a secure runtime for JavaScript and TypeScript, it is an alternative for Node.js")

``` typescript
import * as pkg from 'https://unpkg.com/caterpillar@^8.2.0/edition-deno/index.ts'
```
### [Skypack](https://www.skypack.dev "Skypack is a JavaScript Delivery Network for modern web apps")

``` html
<script type="module">
    import * as pkg from '//cdn.skypack.dev/caterpillar@^8.2.0'
</script>
```
### [unpkg](https://unpkg.com "unpkg is a fast, global content delivery network for everything on npm")

``` html
<script type="module">
    import * as pkg from '//unpkg.com/caterpillar@^8.2.0'
</script>
```
### [jspm](https://jspm.io "Native ES Modules CDN")

``` html
<script type="module">
    import * as pkg from '//dev.jspm.io/caterpillar@8.2.0'
</script>
```
### [Editions](https://editions.bevry.me "Editions are the best way to produce and consume packages you care about.")

This package is published with the following editions:
-   `caterpillar` aliases `caterpillar/index.cjs` which uses the [Editions Autoloader](https://github.com/bevry/editions "You can use the Editions Autoloader to autoload the appropriate edition for your consumers environment") to automatically select the correct edition for the consumer's environment
-   `caterpillar/source/index.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") source code with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `caterpillar/edition-browsers/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2022](https://en.wikipedia.org/wiki/ES2022 "ECMAScript 2022") for web browsers with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `caterpillar/edition-es2022/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2022](https://en.wikipedia.org/wiki/ES2022 "ECMAScript 2022") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 14 || 16 || 18 || 20 || 21 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `caterpillar/edition-es2017/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2017](https://en.wikipedia.org/wiki/ES2017 "ECMAScript 2017") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 8 || 10 || 12 || 14 || 16 || 18 || 20 || 21 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `caterpillar/edition-es2015/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2015](https://babeljs.io/docs/en/learn#ecmascript-2015-features "ECMAScript 2015") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 6 || 8 || 10 || 12 || 14 || 16 || 18 || 20 || 21 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `caterpillar/edition-es5/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against ES5 for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 4 || 6 || 8 || 10 || 12 || 14 || 16 with [Require](https://nodejs.org/dist/latest-v5.x/docs/api/modules.html "Node/CJS Modules") for modules
-   `caterpillar/edition-es2017-esm/index.js` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled against [ES2017](https://en.wikipedia.org/wiki/ES2017 "ECMAScript 2017") for [Node.js](https://nodejs.org "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine") 12 || 14 || 16 || 18 || 20 || 21 with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `caterpillar/edition-types/index.d.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") compiled Types with [Import](https://babeljs.io/docs/learn-es2015/#modules "ECMAScript Modules") for modules
-   `caterpillar/edition-deno/index.ts` is [TypeScript](https://www.typescriptlang.org/ "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.") source code made to be compatible with [Deno](https://deno.land "Deno is a secure runtime for JavaScript and TypeScript, it is an alternative to Node.js")

<!-- /INSTALL -->

<!-- HISTORY/ -->

## History

[Discover the release history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/caterpillar/blob/HEAD/HISTORY.md#files)

<!-- /HISTORY -->

<!-- BACKERS/ -->

## Backers

### Code

[Discover how to contribute via the `CONTRIBUTING.md` file.](https://github.com/bevry/caterpillar/blob/HEAD/CONTRIBUTING.md#files)

#### Authors

-   [Benjamin Lupton](https://balupton.com) — Accelerating collaborative wisdom.

#### Maintainers

-   [Benjamin Lupton](https://balupton.com) — Accelerating collaborative wisdom.

#### Contributors

-   [Benjamin Lupton](https://github.com/balupton) — [view contributions](https://github.com/bevry/caterpillar/commits?author=balupton "View the GitHub contributions of Benjamin Lupton on repository bevry/caterpillar")
-   [t-visualappeal](https://github.com/t-visualappeal) — [view contributions](https://github.com/bevry/caterpillar/commits?author=t-visualappeal "View the GitHub contributions of t-visualappeal on repository bevry/caterpillar")
-   [Tim Helfensdörfer](https://github.com/thelfensdrfer) — [view contributions](https://github.com/bevry/caterpillar/commits?author=thelfensdrfer "View the GitHub contributions of Tim Helfensdörfer on repository bevry/caterpillar")

### Finances

<span class="badge-githubsponsors"><a href="https://github.com/sponsors/balupton" title="Donate to this project using GitHub Sponsors"><img src="https://img.shields.io/badge/github-donate-yellow.svg" alt="GitHub Sponsors donate button" /></a></span>
<span class="badge-thanksdev"><a href="https://thanks.dev/u/gh/bevry" title="Donate to this project using ThanksDev"><img src="https://img.shields.io/badge/thanksdev-donate-yellow.svg" alt="ThanksDev donate button" /></a></span>
<span class="badge-patreon"><a href="https://patreon.com/bevry" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>
<span class="badge-liberapay"><a href="https://liberapay.com/bevry" title="Donate to this project using Liberapay"><img src="https://img.shields.io/badge/liberapay-donate-yellow.svg" alt="Liberapay donate button" /></a></span>
<span class="badge-buymeacoffee"><a href="https://buymeacoffee.com/balupton" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
<span class="badge-opencollective"><a href="https://opencollective.com/bevry" title="Donate to this project using Open Collective"><img src="https://img.shields.io/badge/open%20collective-donate-yellow.svg" alt="Open Collective donate button" /></a></span>
<span class="badge-crypto"><a href="https://bevry.me/crypto" title="Donate to this project using Cryptocurrency"><img src="https://img.shields.io/badge/crypto-donate-yellow.svg" alt="crypto donate button" /></a></span>
<span class="badge-paypal"><a href="https://bevry.me/paypal" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

#### Sponsors

-   [Andrew Nesbitt](https://nesbitt.io) — Software engineer and researcher
-   [Balsa](https://balsa.com) — We're Balsa, and we're building tools for builders.
-   [Codecov](https://codecov.io) — Empower developers with tools to improve code quality and testing.
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Sentry](https://sentry.io) — Real-time crash reporting for your web apps, mobile apps, and games.
-   [Syntax](https://syntax.fm) — Syntax Podcast

#### Donors

-   [Andrew Nesbitt](https://nesbitt.io)
-   [Armen Mkrtchian](https://mogoni.dev)
-   [Balsa](https://balsa.com)
-   [Chad](https://opencollective.com/chad8)
-   [Codecov](https://codecov.io)
-   [dr.dimitru](https://veliovgroup.com)
-   [Elliott Ditman](https://elliottditman.com)
-   [entroniq](https://gitlab.com/entroniq)
-   [GitHub](https://github.com/about)
-   [Hunter Beast](https://cryptoquick.com)
-   [Jean-Luc Geering](https://github.com/jlgeering)
-   [Michael Duane Mooring](https://mdm.cc)
-   [Michael Harry Scepaniak](https://michaelscepaniak.com)
-   [Mohammed Shah](https://github.com/smashah)
-   [Mr. Henry](https://mrhenry.be)
-   [Nermal](https://arjunaditya.vercel.app)
-   [Pleo](https://pleo.io)
-   [Poonacha Medappa](https://poonachamedappa.com)
-   [Rob Morris](https://github.com/Rob-Morris)
-   [Robert de Forest](https://github.com/rdeforest)
-   [Sentry](https://sentry.io)
-   [ServieJS](https://github.com/serviejs)
-   [Skunk Team](https://skunk.team)
-   [Syntax](https://syntax.fm)
-   [WriterJohnBuck](https://github.com/WriterJohnBuck)

<!-- /BACKERS -->

<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

-   Copyright &copy; [Benjamin Lupton](https://balupton.com)

and licensed under:

-   [Artistic License 2.0](http://spdx.org/licenses/Artistic-2.0.html)

<!-- /LICENSE -->
