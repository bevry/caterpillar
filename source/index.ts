import { deep } from 'extendr'
import { PassThrough, Transform as _Transform } from 'stream'
import getLogLevel, { rfcLogLevels, LevelInfo, LevelsMap } from 'rfc-log-levels'
import getCurrentLine, { LineOffset, LineInfo } from 'get-current-line'

/** The log entry that caterpillar creates and forwards to the streams */
export interface LogEntry extends LevelInfo, LineInfo {
	/** the iso string of when the log occured */
	date: string
	/** all the arguments that were after the log level */
	args: any[]
}

/** Configuration for caterpillar and the streams */
export interface Configuration {
	[key: string]: any
}

/** Configuration for caterpillar */
export interface CaterpillarConfiguration extends Configuration {
	lineOffset: LineOffset
	levels: LevelsMap
}

/** Streams that caterpillar can pipe to */
export interface ConfigurableStream extends NodeJS.WritableStream {
	setConfig?: (...configs: Configuration[]) => void
}

/**
 * Logger.
 * This is what we write to.
 * It extends from PassThrough and not transform.
 * If you are piping / writing directly to the logger, make sure it corresponds to the correct entry format (as described in `log`).
 *
 * @param args forwarded to {@link Logger#setConfig}
 *
 * @example Creation
 * ``` javascript
 * // Via class
 * import { Logger } from 'caterpillar'
 * const logger = new Logger()
 * // Via create helper
 * const logger = Logger.create()
 * ```
 */
export class Logger extends PassThrough {
	constructor(...args: any) {
		super(...args)
		this._config = this.getInitialConfig()
		this.setConfig(...args)
	}

	protected _config: CaterpillarConfiguration

	// ===================================
	// Generic Differences
	// This code is shared but different between Logger and Transform

	/**
	 * Get the initial configuration.
	 * Initial log levels are fetched from: https://github.com/bevry/rfc-log-levels
	 */
	getInitialConfig(): CaterpillarConfiguration {
		return {
			lineOffset: {
				file: __filename,
				method: /log/i,
			},
			levels: Object.assign({}, rfcLogLevels, {
				default: 6,
			}),
		}
	}

	/**
	 * Alternative way of creating an instance of the class without having to use the `new` keyword.
	 * Useful when creating the class directly from `require` statements.
	 */
	static create(...args: any) {
		return new this(...args)
	}

	// ===================================
	// Generic
	// This code is shared between Logger and Transform

	/**
	 * Get the current configuration object for this instance.
	 */
	getConfig(): Configuration {
		return this._config
	}

	/**
	 * Apply the specified configurations to this instance's configuration via deep merging.
	 * @example
	 * ``` javascript
	 * setConfig({a: 1}, {b: 2})
	 * getConfig()  // {a: 1, b: 2}
	 * ```
	 */
	setConfig(...configs: Configuration[]) {
		deep(this._config, ...configs)
		this.emit('config', ...configs)
		return this
	}

	/**
	 * Pipe this data to some other writable stream.
	 * If the child stream also has a `setConfig` method, we will ensure the childs configuration is kept consistent with parents.
	 * @param child stream to be piped to
	 * @returns the result of the pipe operation
	 */
	pipe<T extends ConfigurableStream>(child: T): T {
		if (typeof child.setConfig !== 'undefined') {
			child.setConfig(this.getConfig())
			const listener = child.setConfig.bind(child)
			this.on('config', listener)
			child.once('close', () => this.removeListener('config', listener))
		}
		return super.pipe(child)
	}

	// ===================================
	// Logger

	/**
	 * Takes an arguments array and tranforms it into a log entry
	 * @param args
	 */
	getLogEntry(args: any): LogEntry {
		const { lineOffset, levels } = this.getConfig()

		const date = new Date().toISOString()
		const lineInfo = getCurrentLine(lineOffset)

		const level = args.shift()
		let levelInfo = getLogLevel(level, levels)
		if (levelInfo == null) {
			levelInfo = getLogLevel('default', levels)
			if (levelInfo == null) {
				throw new Error(
					'caterpillar: rfc-log-levels: no default log level configuration was provided'
				)
			}
			args.unshift(level)
		}

		return Object.assign({ date, args }, levelInfo, lineInfo)
	}

	/**
	 * Log the arguments into the logger stream as formatted data with debugging information.
	 * Such that our transformers can deal with it intelligently.
	 *
	 * @param args forwarded to {@link Logger#getLogEntry}
	 *
	 * @example Inputs
	 * ``` javascript
	 * logger.log('note', 'this is working swell')
	 * ```
	 * ``` javascript
	 * logger.log('this', 'worked', 'swell')
	 * ```
	 *
	 * @example Results
	 * ``` json
	 * {
	 * 	"args": ["this is working swell"],
	 * 	"date": "2013-04-25T10:18:25.722Z",
	 * 	"levelNumber": 5,
	 * 	"levelName": "notice",
	 * 	"line": "59",
	 * 	"method": "Object.<anonymous>",
	 * 	"file": "/Users/balupton/some-project/calling-file.js"
	 * }
	 * ```
	 * ``` json
	 * {
	 *		"args": ["this", "worked", "well"],
	 *		"date": "2013-04-25T10:18:26.539Z",
	 *		"levelNumber": 6,
	 *		"levelName": "info",
	 *		"line": "60",
	 *		"method": "Object.<anonymous>",
	 *		"file": "/Users/balupton/some-project/calling-file.js"
	 * }
	 * ```
	 */
	log(...args: any) {
		// Fetch the log entry
		const entry = this.getLogEntry(args)

		// Write the arguments as an entry to be transformed by our format
		this.write(JSON.stringify(entry))

		// Chain
		return this
	}
}

/**
 * Transform.
 * This is a helper for our transforms to be able to process the written log data more easily.
 * All the need to do is extend this class and add their own `format` method.
 * @param args forwarded to {@link Logger#setConfig}
 * @example
 * ``` javascript
 * import {inspect} from 'util'
 * import {Logger, Transform} from 'caterpillar'
 * class Pretty extends Transform {
 * 	format (entry) {
 * 		return inspect(entry, {colors: true})
 * 	}
 * }
 * Logger.create()
 * 	.pipe(Pretty.create())
 * 	.pipe(process.stdout)
 * 	.log('note', 'cool times', 5)
 * ```
 */
export class Transform extends _Transform {
	constructor(...args: any) {
		super(...args)
		this._config = this.getInitialConfig()
		this.setConfig(...args)
	}

	_config: Configuration

	// ===================================
	// Generic Differences
	// This code is shared but different between Logger and Transform

	/**
	 * Get the initial configuration option.
	 * Use this to add default/initial configuration to your class.
	 * @returns {Configuration}
	 */
	getInitialConfig() {
		return {}
	}

	/**
	 * Alternative way of creating an instance of the class without having to use the `new` keyword.
	 */
	static create(...args: any) {
		return new this(...args)
	}

	// ===================================
	// Generic
	// This code is shared between Logger and Transform

	/**
	 * Get the current configuration object for this instance.
	 */
	getConfig(): Configuration {
		return this._config
	}

	/**
	 * Apply the specified configurations to this instance's configuration via deep merging.
	 * @param configs
	 * @example
	 * setConfig({a: 1}, {b: 2})
	 * getConfig()  // {a: 1, b: 2}
	 */
	setConfig(...configs: Configuration[]) {
		deep(this._config, ...configs)
		this.emit('config', ...configs)
		return this
	}

	/**
	 * Pipe this data to some other writable stream.
	 * If the child stream also has a `setConfig` method, we will ensure the childs configuration is kept consistent with parents.
	 * @param child stream to be piped to
	 * @returns the result of the pipe operation
	 */
	pipe<T extends ConfigurableStream>(child: T): T {
		if (typeof child.setConfig !== 'undefined') {
			child.setConfig(this.getConfig())
			const listener = child.setConfig.bind(child)
			this.on('config', listener)
			child.once('close', () => this.removeListener('config', listener))
		}
		return super.pipe(child)
	}

	// ===================================
	// Transform

	/**
	 * Transform the written buffer into data we can format
	 * @private
	 * @param chunk
	 * @param encoding
	 * @param next
	 */
	_transform(
		chunk: Buffer | string,
		encoding: string,
		next: (error?: Error | null, message?: string) => any
	) {
		let message = chunk.toString()

		try {
			message = this.format(message)
		} catch (err) {
			return next(err)
		}

		if (message && typeof message === 'object') {
			message = JSON.stringify(message)
		}

		return next(null, message)
	}

	/**
	 * Format the written data into whatever we want.
	 * Here is where our transformers work with the written data to enhance it.
	 * By default (without any other transformers at work) this will be a stringified {@link LogEntry}.
	 * @param message
	 */
	format(message: string): any {
		return message
	}
}

// Aliases
export const create = Logger.create.bind(Logger)
