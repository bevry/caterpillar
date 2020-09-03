// Imports
import { LogEntry } from '../logger.js'
import { Transform } from '../transform.js'
import { inspect } from 'util'
import * as ansi from '@bevry/ansi'

/**
 * Return the given argument.
 * Used for when there is no formatter.
 */
export function noop<T>(str: T): T {
	return str
}

/** A mapping of log level numbers to their intended colours */
interface LevelsToColorsMap {
	[logLevelNumber: string]: ansi.ANSIApplier
}

/** Configuration optons for the Caterpillar Human Transform */
export interface HumanOptions {
	/** Use to override the default value of {@link Human.color} */
	color?: boolean

	/** Use to override the default value of {@link Human.colors} */
	colors?: LevelsToColorsMap
}

/**
 * Convert Logger entries into human readable format.
 * @extends Transform
 * @example
 * ``` javascript
 * import { Logger, Human } from 'caterpillar'
 * const logger = new Logger()
 * const human = new Human()
 * logger.pipe(human).pipe(process.stdout)
 * logger.log('info', 'some', {data: 'oh yeah'}, 42)
 * ```
 */
export class Human extends Transform {
	/** Whether or not to use colors? */
	public color: boolean = true

	/** Mapping of which log level numbers correspond to which colours */
	public colors: LevelsToColorsMap = {
		'0': 'red',
		'1': 'red',
		'2': 'red',
		'3': 'red',
		'4': 'yellow',
		'5': 'yellow',
		'6': 'green',
		'7': 'green',
	}

	/** Create our instance and apply our configuraiton options. */
	constructor(opts?: HumanOptions) {
		super()

		// options
		if (opts?.color != null) this.color = opts.color
		if (opts?.colors != null) this.colors = opts.colors
	}

	/** Get the color for the log level */
	getColor(levelNumber: number): ansi.ANSIApplier | false {
		// Determine
		const color = this.colors[levelNumber] || false

		// Return
		return color
	}

	/** Pad the left of some content if need be with the specified padding to make the content reach a certain size */
	padLeft(padding: string, size: number, content: string | number): string {
		// Prepare
		padding = String(padding)
		content = String(content)

		// Handle
		if (content.length < size) {
			for (let i = 0, n = size - content.length; i < n; ++i) {
				content = padding + content
			}
		}

		// Return
		return content
	}

	/** Convert logger entry arguments into a human readable string */
	formatArguments(args: any[]): string {
		return args
			.map((value) =>
				typeof value === 'string'
					? value
					: inspect(value, {
							showHidden: false,
							depth: 10,
							colors: this.color,
					  })
			)
			.join(' ')
	}

	/** Convert a datetime into a human readable format */
	formatDate(datetime: Date | number | string): string {
		// Prepare
		const now = new Date(datetime)
		const year = now.getFullYear()
		const month = this.padLeft('0', 2, now.getMonth() + 1)
		const date = this.padLeft('0', 2, now.getDate())
		const hours = this.padLeft('0', 2, now.getHours())
		const minutes = this.padLeft('0', 2, now.getMinutes())
		const seconds = this.padLeft('0', 2, now.getSeconds())
		const ms = this.padLeft('0', 3, now.getMilliseconds())

		// Apply
		const result = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}.${ms}`

		// Return
		return result
	}

	/** Convert a logger entry into a human readable format */
	format(entry: LogEntry): string {
		// Prepare
		const { color } = this
		const useLine = entry.line !== -1
		let result: string

		// Format
		const format = {
			color: this.getColor(entry.levelNumber),
			timestamp: this.formatDate(entry.date),
			text: this.formatArguments(entry.args),
		}

		// Check
		if (format.text) {
			// Formatters
			const levelFormatter =
				(color && format.color && ansi[format.color]) || noop
			const lineFormatter = (useLine && color && ansi.dim) || noop

			// Message
			const levelString = levelFormatter(`${entry.levelName}:`)
			const entryString = format.text
			const messageString = `${levelString} ${entryString}`

			// Format
			if (useLine) {
				// Line Information
				const seperator = '\n    '
				const debugString = lineFormatter(
					`→ [${format.timestamp}] [${entry.file}:${entry.line}:${entry.char}] [${entry.method}]`
				)

				// Result
				result = `${messageString}${seperator}${debugString}\n`
			} else {
				// Result
				result = `${messageString}\n`
			}
		} else {
			result = format.text
		}

		// Return
		return result
	}
}

export default Human
