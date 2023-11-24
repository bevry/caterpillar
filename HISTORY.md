# History

## v7.0.0 2023 November 24

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required Node.js version changed from `node: >=10` to `node: >=6` adapting to ecosystem changes

## v6.12.0 2023 November 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.11.0 2023 November 15

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.10.0 2023 November 14

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.9.0 2023 November 14

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Updated license from [`MIT`](http://spdx.org/licenses/MIT.html) to [`Artistic-2.0`](http://spdx.org/licenses/Artistic-2.0.html)

## v6.8.0 2021 July 30

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.7.0 2021 July 29

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.6.0 2020 October 29

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.5.0 2020 September 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.4.0 2020 August 18

-   Updated for [`get-current-line` v6](https://github.com/bevry/get-current-line), which also returns the character position of the line
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.3.0 2020 August 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.2.0 2020 August 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.1.0 2020 August 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.0.2 2020 July 22

-   Updated Transform documentation and renamed `Writeable` internal type to `Pipeable` to reflect its purpose better

## v6.0.1 2020 July 22

-   Updated dependencies, fixes Node.js due to missing `semver` dependency under `editions`
    -   Closes [issue #80](https://github.com/bevry/caterpillar/issues/80)

## v6.0.0 2020 July 24

-   Breaking Changes: Caterpillar has been rewritten for performance, ease of use, and deno compatibility (now it is compatible with Node.js, Deno, and Web Browsers)
-   The Caterpillar Transforms by Bevry, are now embedded into the `caterpillar` package:
    -   `caterpillar-filter` is now `import { Filter } from 'caterpillar'`
    -   `caterpillar-human` is now `import { Human } from 'caterpillar'`
    -   `caterpillar-browser` is now `import { Browser } from 'caterpillar'`
-   `*.create()` aliases for `new *()` are now removed, please just use `new *(config)`
-   Each Caterpillar Transform now maintains its own configuration, which is specified via their constructor
    -   As such, instead of doing `new *().setConfig(opts)` now jsut do `new *(opts)`
-   the default log level is now a configuration option, rather than an entry in the levels map
-   `level` configuration option has been renamed to `filterLevel`, which must now be specified directly on the filter transform
-   the logger transform now accepts a new `lineLevel` configuration option, which will limit fetching line info for only log levels equal to or below that the `lineLevel` value, by default it is `-1` which disables fetching line info
    -   This is a dramatic performance improvement for large applications, as fetching line levels for every log entry, even ones filtered out, was not performant
    -   Closes [issue #16](https://github.com/bevry/caterpillar/issues/16)
-   Caterpillar Transforms are no longer Node.js Streams, as using them was a major performance overhead
    -   We can still pipe to Caterpillar Transforms as well as to Node.js streams and WHATWG/Deno streams
    -   Closes [issue #17](https://github.com/bevry/caterpillar/issues/17)
-   Add `error`, `warn`, `info`, `debug` aliases to the logger
    -   Thanks to [Kirill Chernyshov](https://github.com/DeLaGuardo) for [issue #12](https://github.com/bevry/caterpillar/issues/12)
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.15.0 2020 July 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.14.0 2020 July 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.13.0 2020 July 3

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.12.0 2020 July 3

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.11.0 2020 June 25

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.10.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.9.0 2020 June 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.8.0 2020 June 20

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.7.0 2020 June 20

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.6.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.5.0 2020 June 10

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.4.0 2020 May 22

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.3.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.2.0 2020 May 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.1.2 2020 May 8

-   Added Logger as a default export, for better compat with the filters

## v5.1.1 2020 May 8

-   Fix some types on the Transform class

## v5.1.0 2020 May 8

-   Merge source code into a single file, and export the various types

## v5.0.0 2020 May 8

-   Converted from JavaScript to TypeScript, no functionality changes here
-   Extracted the current line functionality into [get-current-line](https://github.com/bevry/get-current-line), which uses [a different means of calculating the offset](https://github.com/bevry/get-current-line/blob/master/HISTORY.md#v500-2020-may-8) which **you should refer to if you ever used custom offsets**
-   Extracted the log level functionality into [rfc-log-levels](https://github.com/bevry/rfc-log-levels), existing functionality is retained
-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=10` to keep up with mandatory ecosystem changes

## v4.0.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=0.10` to `node: >=8` to keep up with mandatory ecosystem changes

## v3.3.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.2.0 2019 January 1

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v3.1.2 2018 September 3

-   Updated base files and [editions](https://github.com/bevry/editions) using [boundation](https://github.com/bevry/boundation)

## v3.1.1 2018 August 19

-   Readded support for node 0.10

## v3.1.0 2018 August 17

-   Now uses [rfc-log-levels](https://github.com/bevry/log-levels) for the initial log levels
-   Moved type linting from flow to jsdoc & typescript, which also results in better documentation for you, and visual studio code intellisense`
-   Updated base files and [editions](https://github.com/bevry/editions) using [boundation](https://github.com/bevry/boundation)

## v3.0.1 2016 October 20

-   Fixed flow type errors with newer flow versions

## v3.0.0 2016 May 4

-   Converted from CoffeeScript to JavaScript
-   `.createLogger()` and `.createTransform()` now removed in favour of `Logger.create()` and `Transform.create()`
-   `require('caterpillar').create()` alias added
-   Logger no longer inherits from Transform

## v2.0.9 2015 February 18

-   Fixed an issue when fetching `(new Error()).stack` would fail
-   More robust stack parsing

## v2.0.8 2015 February 7

-   Updated dependencies

## v2.0.7 2013 December 12

-   Use native streams if available, otherwise fallback to [readable-stream](https://npmjs.org/package/readable-stream)
-   Repackaged

## v2.0.6 2013 October 23

-   `Logger:log` is now permantely bound to the logger instance, for easy passing around

## v2.0.5 2013 October 23

-   Added `create` API to make life easier when doing one liners
-   Project meta data files are now maintained by [Projectz](https://github.com/bevry/projectz)
-   Updated dependencies

## v2.0.4 2013 July 23

-   Added `lineOffset` configuration offset to allow you to detect the correct line of the reporting when using wrappers
-   Updated dependencies

## v2.0.3 2013 May 19

-   iOS support (iOS devices do not have `new Error().stack`)

## v2.0.2 2013 May 7

-   Fixed defaulting the log level - Closes [issue #6](https://github.com/bevry/caterpillar/issues/6) reported by [Erik Dasque](https://github.com/edasque)

## v2.0.1 2013 April 25

-   Node 0.8 support

## v2.0.0 2013 April 25

-   Rewrote using streams

## v1.1.4 2013 March 25

-   Repackaged

## v1.1.3 2012 October 18

-   Updated cli-color from 0.1 to 0.2
-   Make cli-color an optional dependency

## v1.1.2 2012 August 10

-   Rejigged directory structure
-   Re-added markdown files to npm distribution as they are required for the npm website

## v1.1.1 2012 May 4

-   Fixed dependency overwrite

## v1.1.0 2012 May 4

-   Caterpillar now pre-compiles, so the coffee-script dependency is no longer needed

## v1.0.0 2012 February 11

-   Modularised
-   Added [docco](http://jashkenas.github.com/docco/) docs
-   Debug line is now only outputted if the log level is 7
-   Added `setLevel(level)`
-   Added `History.md`
-   Added new screenshots
-   `cli-color` dependency now accepts revisions

## v0.1 2011 September 5

-   Initial commit
