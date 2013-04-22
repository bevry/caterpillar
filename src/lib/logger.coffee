# Import
extendr = require('extendr')
stream = require('stream')

# Logger
class Logger extends stream.Transform
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

	constructor: (opts) ->
		@setConfig(opts)
		super

	pipe: (child) ->
		if child.setConfig?(@config) then @on('config', child.setConfig)
		super

	setConfig: (opts) =>
		@config = extendr.deepExtend({}, @config, opts)
		@

	getConfig: -> @config

	_transform: (chunk, encoding, next) ->
		return next(null, chunk)

	getLevelCode: (name) ->
		# Return
		return @config.levels[name] ? null

	getLevelName: (code) ->
		# Try to treturn the levelName
		for own key,value of @config.levels
			if value is code
				return key

		# Return
		return null

	getLevelInfo: (level) ->
		# Prepare
		result =
			levelCode: null
			levelName: null

		# Log the entry
		if typeof level is 'number'
			levelCode = level
			levelName = @getLevelName(levelCode)
		else
			levelName = level
			levelCode = @getLevelCode(levelName)
			levelName = @getLevelName(levelCode)
			unless levelCode?
				levelCode = @getLevelCode('default')
				levelName = @getLevelName(levelCode)

		# Apply
		result.levelCode = levelCode
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
		entry.args = args
		entry.date = new Date().toISOString()
		entry[key] = value  for own key,value of @getLevelInfo(level)
		entry[key] = value  for own key,value of @getLineInfo(level)

		# Return
		return entry

	log: (level, args...) ->
		# Prepare
		entry = @format(level, args...)

		# Write the entry
		@write(JSON.stringify(entry))

		# Chain
		@

# Export
module.exports = {
	Logger
}