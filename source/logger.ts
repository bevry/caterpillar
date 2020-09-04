import getLogLevel, { rfcLogLevels, LevelInfo, LevelsMap } from 'rfc-log-levels'
import getCurrentLine, { Offset, Location } from 'get-current-line'
import { Transform } from './transform.js'

/** The log entry that Caterpillar creates and forwards to its transforms */
export interface LogEntry extends LevelInfo, Location {
	/** the iso string of when the log occured */
	date: string
	/** all the arguments that were after the log level */
	args: any[]
}

/** Configuration for the Caterpillar Logger */
export interface LoggerOptions {
	/** Use to override the default value of {@link Logger.lineOffset} */
	lineOffset?: Offset

	/** Use to override the default value of {@link Logger.levels} */
	levels?: LevelsMap

	/** Use to override the default value of {@link Logger.defaultLevelInfo} */
	defaultLevel?: number | string

	/** Use to override the default value of {@link Logger.lineLevel} */
	lineLevel?: number
}

/**
 * Logger.
 * This is what we write to.
 * @example Creation
 * ``` javascript
 * // Via class
 * import { Logger } from 'caterpillar'
 * const logger = new Logger()
 * ```
 */
export class Logger extends Transform {
	/**
	 * The configuration to use for the line offset.
	 * This defaults to any file path that includes `logger`, and any method that includes the word `log`.
	 */
	public lineOffset: Offset = {
		file: /logger/i,
		method: /log/i,
	}

	/**
	 * The mapping of log level names to log level numbers.
	 * Defaults to the RFC Log Level configuration.
	 */
	public levels: LevelsMap = rfcLogLevels

	/**
	 * The log level information to use when the log level was unable to be determined.
	 * Defaults to the info log level.
	 */
	public defaultLevelInfo!: LevelInfo

	/** Set the default level info via a level number or name. */
	public set defaultLevel(value: number | string) {
		const levelInfo = this.getLogLevel(value)
		if (levelInfo == null) {
			throw new Error(
				`caterpillar: the intended value of ${value} for the default log level not found in the configured levels`
			)
		}
		this.defaultLevelInfo = levelInfo
	}

	/**
	 * Only fetch line information for entries that have a log level equal to, or below this number.
	 * You should only specify this if you need it, as fFetching line information for thousands of log entries, which is typical in large applications, will slow your application down dramatically.
	 * If not specified, defaults to `-Infinity` which effect is to ignore gathering line information for all log levels.
	 */
	public lineLevel: number = -Infinity

	/** Create our instance and apply our configuraiton options. */
	constructor(opts?: LoggerOptions) {
		super()

		// options
		if (opts?.lineOffset != null) this.lineOffset = opts.lineOffset
		if (opts?.levels != null) this.levels = opts.levels
		if (opts?.lineLevel != null) this.lineLevel = opts.lineLevel

		// options: default level
		this.defaultLevel = opts?.defaultLevel ?? 'info'

		// dereference
		this.levels = Object.assign({}, this.levels)
	}

	/** Alias for {@link getLogLevel} using the configured logger levels as reference. */
	getLogLevel(value: number | string) {
		return getLogLevel(value, this.levels)
	}

	/** Takes an arguments array and tranforms it into a log entry. */
	format(args: any): LogEntry {
		// fetch the level
		const level = args.shift()
		let levelInfo =
			level === 'default' ? this.defaultLevelInfo : this.getLogLevel(level)
		if (levelInfo == null) {
			// fallback to the default log level
			levelInfo = this.defaultLevelInfo
			// as the level (first param) was not actually a level, put it back
			args.unshift(level)
		}

		// fetch the date
		const date = new Date().toISOString()

		// fetch the line information
		const lineInfo =
			levelInfo.levelNumber <= this.lineLevel
				? getCurrentLine(this.lineOffset)
				: {
						line: -1,
						char: -1,
						method: '',
						file: '',
				  }

		// put it all together
		return Object.assign({ date, args }, levelInfo, lineInfo)
	}

	/**
	 * Log the arguments into the logger stream as formatted data with debugging information.
	 * Such that our transformers can deal with it intelligently.
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
		this.write(args)
	}

	/** Alias for log which prefixes the error log level */
	error(...args: any) {
		this.write(['error', ...args])
	}

	/** Alias for log which prefixes the warn log level */
	warn(...args: any) {
		this.write(['warn', ...args])
	}

	/** Alias for log which prefixes the info log level */
	info(...args: any) {
		this.write(['info', ...args])
	}

	/** Alias for log which prefixes the debug log level */
	debug(...args: any) {
		this.write(['debug', ...args])
	}
}

export default Logger
