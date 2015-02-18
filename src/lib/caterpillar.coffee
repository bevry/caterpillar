# Import
extendr = require('extendr')
stream = require('stream')
stream = require('readable-stream')  if stream.Transform? is false

# Transform
class Transform extends stream.Transform
	config: null

	constructor: (opts) ->
		@config = extendr.deepClone(@config)
		@setConfig(opts)
		super

	pipe: (child) =>
		if child.setConfig?(@config) then @on('config', child.setConfig)
		super

	setConfig: (opts) =>
		extendr.deepExtend(@config, opts)
		@emit('config', @config)
		@

	getConfig: ->
		return @config

	_transform: (chunk, encoding, next) =>
		entry = JSON.parse(chunk.toString())
		message = @format(entry)
		message = JSON.stringify(message)  if message
		return next(null, message)

	format: (entry) ->
		return entry

# Logger
class Logger extends Transform
	config:
		lineOffset: 0
		levels:
			emergency: 0
			alert: 1
			critical: 2
			error: 3
			warning: 4
			notice: 5
			info: 6
			debug: 7

			emerg: 0
			crit: 2
			err: 3
			warn: 4
			note: 5

			default: 6

	_transform: (chunk, encoding, next) ->
		return next(null, chunk)

	getLevelNumber: (name) ->
		return @config.levels[name] ? null

	getLevelName: (number) ->
		# Try to treturn the levelName
		for own key,value of @config.levels
			if value is number
				return key

		# Return
		return null

	getLevelInfo: (level) ->
		# Prepare
		result =
			levelNumber: null
			levelName: null
			defaulted: false

		# Log the entry
		if typeof level is 'number'
			levelNumber = level
			levelName = @getLevelName(levelNumber)
		else
			levelName = level
			levelNumber = @getLevelNumber(levelName)
			levelName = @getLevelName(levelNumber)
			unless levelNumber?
				levelNumber = @getLevelNumber('default')
				levelName = @getLevelName(levelNumber)
				result.defaulted = true

		# Apply
		result.levelNumber = levelNumber
		result.levelName = levelName

		# Return
		return result

	getLineInfo: ->
		# Prepare
		result =
			line: -1
			method: 'unknown'
			file: 'unknown'

		try
			# Create an error
			err = new Error()

			# And attempt to retrieve it's stack
			# https://github.com/winstonjs/winston/issues/401#issuecomment-61913086
			try
				stack = err.stack
			catch
				try
					stack = err.__previous__?.stack
				catch
					stack = null

			# Handle different stack formats
			if stack
				if Array.isArray(err.stack)
					lines = err.stack
				else
					lines = err.stack.toString().split('\n')
			else
				lines = []

			# Handle different line formats
			lines = lines
				.map (line) -> (line or '').toString()
				.filter (line) -> line.length isnt 0

			# Parse our lines
			offset = @config.lineOffset
			for line in lines
				if line.indexOf(__dirname) isnt -1 or line.indexOf(' at ') is -1
					continue

				if offset isnt 0
					--offset
					continue

				parts = line.split(':')
				if parts.length >= 2
					if parts[0].indexOf('(') is -1
						result.method = 'unknown'
						result.file = parts[0].replace(/^.+?\s+at\s+/, '')
					else
						result.method = parts[0].replace(/^.+?\s+at\s+/, '').replace(/\s+\(.+$/, '')
						result.file = parts[0].replace(/^.+?\(/, '')
					result.line = parts[1]
					break
		catch err
			throw new Error('Caterpillar.getLineInfo: Failed to parse the error stack: '+err.toString())

		# Return
		return result

	format: (level, args...) ->
		# Prepare
		entry = {}
		entry.date = new Date().toISOString()

		# Prepare
		levelInfo = @getLevelInfo(level)
		lineInfo = @getLineInfo(level)

		# Add the level to the message arguments if it was not a level
		args.unshift(level)  if levelInfo.defaulted and level isnt 'default'
		delete levelInfo.defaulted

		# Apply
		entry.args = args
		extendr.extend(entry, levelInfo, lineInfo)

		# Return
		return entry

	log: (args...) =>
		# Prepare
		entry = @format(args...)

		# Emit the entry
		@emit('log', entry)

		# Write the entry
		entryString = JSON.stringify(entry)
		@write(entryString)

		# Chain
		@

# Export
module.exports = {
	# Classes
	Transform
	Logger

	# Instantiators
	createTransform: (args...) ->  new Transform(args...)
	createLogger: (args...) ->  new Logger(args...)
}