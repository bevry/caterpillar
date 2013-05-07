# Import
extendr = require('extendr')
stream = require('readable-stream')

# Transform
class Transform extends stream.Transform
	config: null

	constructor: (opts) ->
		@config = extendr.deepClone(@config)
		@setConfig(opts)
		super

	pipe: (child) ->
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

		# Retrieve
		err = new Error()
		lines = err.stack.split('\n')
		for line in lines
			continue  if line.indexOf(__dirname) isnt -1 or line.indexOf(' at ') is -1
			parts = line.split(':')
			if parts[0].indexOf('(') is -1
				result.method = 'unknown'
				result.file = parts[0].replace(/^.+?\s+at\s+/, '')
			else
				result.method = parts[0].replace(/^.+?\s+at\s+/, '').replace(/\s+\(.+$/, '')
				result.file = parts[0].replace(/^.+?\(/, '')
			result.line = parts[1]
			break

		# Return
		return result

	format: (level, args...) ->
		# Prepare
		entry = {}
		entry.date = new Date().toISOString()

		# Prepare
		levelInfo  = @getLevelInfo(level)
		lineInfo   = @getLineInfo(level)

		# Add the level to the message arguments if it was not a level
		args.unshift(level)  if levelInfo.defaulted and level isnt 'default'
		delete levelInfo.defaulted

		# Apply
		entry.args = args
		extendr.extend(entry, levelInfo, lineInfo)

		# Return
		return entry

	log: (args...) ->
		# Prepare
		entry = @format(args...)
		entryString = JSON.stringify(entry)

		# Write the entry
		@write(entryString)

		# Chain
		@

# Export
module.exports = {
	Transform
	Logger
}