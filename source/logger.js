/* @flow */
import {extend, deep} from 'extendr'
import {PassThrough} from 'stream'

/* ::
type levelInfo = {
	levelNumber:number,
	levelName:string
};
type lineInfo = {
	line:number,
	method:string,
	file:string
};
type logEntry = {
	date:string,
	args:Array<any>
};
*/

// Default configuration reference for speed
const loggerDefaultConfig = {
	lineOffset: 0,
	levels: {
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

		'default': 6
	}
}

// Logger
export class Logger extends PassThrough {
	// ===================================
	// Generic

	/* :: _config:Object; */

	static create (...args) {
		return new this(...args)
	}

	getConfig () /* :Object */ {
		return this._config || {}
	}

	setConfig (...configs /* :Array<Object> */ ) /* :this */ {
		this._config = deep(this.getConfig(), ...configs)
		this.emit('config', ...configs)
		return this
	}

	pipe (child /* :Object */ ) /* :any */ {
		if ( child.setConfig ) {
			child.setConfig(this.getConfig())
			const listener = child.setConfig.bind(child)
			this.on('config', listener)
			child.on('close', () => this.removeListener('config', listener))
		}
		return super.pipe(child)
	}

	// ===================================
	// Transform

	constructor (config /* :?Object */) {
		super(config)  // new stream.Transform([options])
		if ( config ) {
			this.setConfig(loggerDefaultConfig, config)
		}
		else {
			this.setConfig(loggerDefaultConfig)
		}
	}

	getLevelNumber (name /* :string */) /* :number */ {
		const {levels} = this.getConfig()
		if ( levels[name] == null ) {
			throw new Error(`No level number was found for the level name: ${name}`)
		}
		else {
			return levels[name]
		}
	}

	getLevelName (number /* :number */) /* :string */ {
		const {levels} = this.getConfig()

		// Try to return the levelName
		for ( const name in levels ) {
			if ( levels.hasOwnProperty(name) ) {
				const value = levels[name]
				if ( value === number ) {
					return name
				}
			}
		}

		// Return
		throw new Error(`No level name was found for the level number: ${number}`)
	}

	getLevelInfo (level /* :string|number */) /* :levelInfo */ {
		if ( typeof level === 'string' ) {
			const levelNumber = this.getLevelNumber(level)  // will throw if not found
			const levelName = this.getLevelName(levelNumber)  // name could be shortened, so get the expanded name
			return {levelNumber, levelName}
		}
		else if ( typeof level === 'number' ) {
			const levelName = this.getLevelName(level)  // will throw if not found
			return {levelNumber: level, levelName}
		}
		else {
			throw new Error(`Unknown level type: ${typeof level} for ${level}`)
		}
	}

	getLineInfo () /* :lineInfo */ {
		// Prepare
		let offset = this.getConfig().lineOffset
		const result = {
			line: -1,
			method: 'unknown',
			file: 'unknown'
		}

		try {
			// Create an error
			const err = new Error()
			let stack, lines

			// And attempt to retrieve it's stack
			// https://github.com/winstonjs/winston/issues/401#issuecomment-61913086
			try {
				stack = err.stack
			}
			catch (error1) {
				try {
					stack = err.__previous__ && err.__previous__.stack
				}
				catch (error2) {
					stack = null
				}
			}

			// Handle different stack formats
			if ( stack ) {
				if ( Array.isArray(stack) ) {
					lines = Array(stack)
				}
				else {
					lines = stack.toString().split('\n')
				}
			}
			else {
				lines = []
			}

			// Handle different line formats
			lines = lines
				// Ensure each line item is a string
				.map((line) => (line || '').toString())
				// Filter out empty line items
				.filter((line) => line.length !== 0)

			// Parse our lines
			for ( const line of lines ) {
				if ( line.indexOf(__dirname) !== -1 || line.indexOf(' at ') === -1 ) {
					continue
				}

				if ( offset !== 0 ) {
					--offset
					continue
				}

				const parts = line.split(':')
				if ( parts.length >= 2 ) {
					if ( parts[0].indexOf('(') === -1 ) {
						result.method = 'unknown'
						result.file = parts[0].replace(/^.+?\s+at\s+/, '')
					}
					else {
						result.method = parts[0].replace(/^.+?\s+at\s+/, '').replace(/\s+\(.+$/, '')
						result.file = parts[0].replace(/^.+?\(/, '')
					}
					result.line = parts[1]
					break
				}
			}
		}
		catch ( err ) {
			throw new Error(`Caterpillar.getLineInfo: Failed to parse the error stack: ${err}`)
		}

		// Return
		return result
	}

	log (...args /* :Array<any> */ ) /* :this */ {
		const date = new Date().toISOString()
		const lineInfo = this.getLineInfo()

		const level /* :string|number */ = args.shift()
		let levelInfo
		try {
			levelInfo = this.getLevelInfo(level)
		}
		catch (err) {
			// if it threw (level was not a valid name or number), then use the default level
			levelInfo = this.getLevelInfo('default')
			args.unshift(level)
		}

		// Create the entry by mashing them together
		const entry /* :logEntry */ = extend({date, args}, levelInfo, lineInfo)

		// Write the arguments as an entry to be transformed by our format
		this.write(JSON.stringify(entry))

		// Chain
		return this
	}
}
