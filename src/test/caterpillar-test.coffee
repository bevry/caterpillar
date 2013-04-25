# Import
{expect} = require('chai')
joe = require('joe')
{Transform,Logger} = require('../../')
{PassThrough} = require('readable-stream')

# Prepare
cleanChanging = (item) ->
	item = JSON.parse(item)
	item.date = item.date.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, 'date')
	item.file = item.file.replace(/^[\/\\].+$/, 'file')
	item.line = item.file.replace(/^\d{1,}$/, 'line')
	item.method = item.method.replace(/^[\d\w\.]+$/, 'method')
	return item

# Test
joe.describe 'caterpillar', (describe,it) ->

	describe 'transform', (describe,it) ->
		transform = null

		it 'should instantiate correctly', ->
			transform = new Transform()

		it 'get config should work', ->
			expect(transform.getConfig()).to.eql(transform.config)

		it 'should set configuration correctly', ->
			transform.setConfig(level:5)
			expect(transform.getConfig().level).to.eql(5)

		it 'should set configuration correctly via constructor', ->
			transform = new Transform(level:4)
			expect(transform.getConfig().level).to.eql(4)

		it 'should pass configuration to the child via constructor', ->
			transform = new Transform(level:3)
			transform2 = new Transform()
			transform.pipe(transform2)
			expect(transform2.getConfig().level).to.eql(3)

		it 'should pass configuration to the child via set config after the fact', ->
			transform = new Transform()
			transform2 = new Transform()
			transform.pipe(transform2)
			transform.setConfig(level:2)
			expect(transform2.getConfig().level).to.eql(2)


	describe 'logging', (describe,it) ->
		logger = new Logger()
		output = new PassThrough()
		actual = []
		expected = [
			'{"args":["this is emergency and is level 0"],"date":"2013-04-25T10:18:25.722Z","levelNumber":0,"levelName":"emergency","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is alert and is level 1"],"date":"2013-04-25T10:18:25.729Z","levelNumber":1,"levelName":"alert","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is critical and is level 2"],"date":"2013-04-25T10:18:25.730Z","levelNumber":2,"levelName":"critical","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is error and is level 3"],"date":"2013-04-25T10:18:25.731Z","levelNumber":3,"levelName":"error","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is warning and is level 4"],"date":"2013-04-25T10:18:25.731Z","levelNumber":4,"levelName":"warning","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is notice and is level 5"],"date":"2013-04-25T10:18:25.732Z","levelNumber":5,"levelName":"notice","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is info and is level 6"],"date":"2013-04-25T10:18:25.732Z","levelNumber":6,"levelName":"info","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is debug and is level 7"],"date":"2013-04-25T10:18:25.733Z","levelNumber":7,"levelName":"debug","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is emerg and is level 0"],"date":"2013-04-25T10:18:25.734Z","levelNumber":0,"levelName":"emergency","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is crit and is level 2"],"date":"2013-04-25T10:18:25.734Z","levelNumber":2,"levelName":"critical","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is err and is level 3"],"date":"2013-04-25T10:18:25.735Z","levelNumber":3,"levelName":"error","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is warn and is level 4"],"date":"2013-04-25T10:18:25.735Z","levelNumber":4,"levelName":"warning","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is note and is level 5"],"date":"2013-04-25T10:18:25.736Z","levelNumber":5,"levelName":"notice","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"args":["this is default and is level 6"],"date":"2013-04-25T10:18:25.736Z","levelNumber":6,"levelName":"info","line":"59","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}'
		].map(cleanChanging)

		output.on 'data', (chunk) ->
			actual.push chunk.toString()

		it 'should pipe correctly', ->
			logger.pipe(output)

		it 'should log messages', ->
			for own name,code of Logger::config.levels
				message = "this is #{name} and is level #{code}"
				logger.log(name, message)

		it 'should provide the expected output', (done) ->
			output.on 'end', ->
				actual = actual.map(cleanChanging)
				expect(actual.length).to.equal(expected.length)
				for result,index in actual
					expect(result).to.deep.equal(expected[index])
				done()
			logger.end()
