import { LogEntry } from '../logger.js'
import { Transform } from '../transform.js'

/** Configuration options for the Caterpillar Filter Transform */
export interface FilterOptions {
	/** Use to override the default value of {@link Filter.filterLevel} */
	filterLevel?: number
}

/**
 * Caterpillar Filter Transform.
 * Filters the log entries, keeping only those equal to or below the specified `filterLevel`.
 * @example
 * ``` javascript
 * import { Logger, Filter } from 'caterpillar'
 * const logger = new Logger()
 * const filter = new Filter({ filterLevel: 6 })
 * logger.pipe(filter).pipe(process.stdout)
 * logger.log('info', 'this will be outputted')
 * logger.log('debug', 'this will be ignored')
 * filter.config.filterLevel = 5
 * logger.log('info', 'now even this will be ignored')
 * logger.log('note', 'but not this')
 * ```
 */
export class Filter extends Transform {
	/**
	 * Only display entries that have a log level below or equal to this number.
	 * Defaults to `6`, which by default is the info log level.
	 */
	public filterLevel: number = 6

	/** Create our instance and apply our configuraiton options. */
	constructor(opts?: FilterOptions) {
		super()

		// options
		if (opts?.filterLevel != null) this.filterLevel = opts.filterLevel
	}

	/** Retain only log entries that are equal to or less than the specified filter level. */
	format(entry: LogEntry): LogEntry | null {
		return entry.levelNumber <= this.filterLevel ? entry : null
	}
}

export default Filter
