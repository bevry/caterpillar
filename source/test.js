
// Import
import {Transform, Logger} from './index.js'
import {PassThrough} from 'stream'
import joe from 'joe'
import {equal, deepEqual} from 'assert-helpers'

// Prepare
function cleanChanging (item) {
	item = JSON.parse(item)
	item.date = item.date.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/, 'date')
	item.file = item.file.replace(/^[\/\\].+$/, 'file')
	item.line = item.file.replace(/^\d{1,}$/, 'line')
	item.method = item.method.replace(/^[\d\w\.\_\-\<\>]+$/, 'method')
	return item
}

// Test
joe.describe('caterpillar', function (describe) {

	describe('transform', function (describe, it) {
		it('should instantiate correctly', function () {
			/* eslint no-unused-vars:0 */
			const transform = new Transform()
		})

		it('should set configuration correctly', function () {
			const transform = new Transform()
			transform.setConfig({level: 5})
			equal(transform.getConfig().level, 5)
		})

		it('should set configuration correctly via constructor', function () {
			const transform = new Transform({level: 4})
			equal(transform.getConfig().level, 4)
		})

		it('should pass configuration to the child via constructor', function () {
			const transform = new Transform({level: 3})
			const transform2 = new Transform()
			transform.pipe(transform2)
			equal(transform2.getConfig().level, 3)
		})

		it('should pass configuration to the child via set config after the fact', function () {
			const transform = new Transform()
			const transform2 = new Transform()
			transform.pipe(transform2)
			transform.setConfig({level: 2})
			equal(transform2.getConfig().level, 2)
		})
	})

	describe('logging', function (describe, it) {
		const logger = new Logger()
		const output = new PassThrough()
		const actual = []
		const expected = [
			'{"date":"2013-05-07T11:12:43.982Z","args":["this is emergency and is level 0"],"levelNumber":0,"levelName":"emergency","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.986Z","args":["this is alert and is level 1"],"levelNumber":1,"levelName":"alert","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.987Z","args":["this is critical and is level 2"],"levelNumber":2,"levelName":"critical","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.987Z","args":["this is error and is level 3"],"levelNumber":3,"levelName":"error","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.988Z","args":["this is warning and is level 4"],"levelNumber":4,"levelName":"warning","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.988Z","args":["this is notice and is level 5"],"levelNumber":5,"levelName":"notice","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.989Z","args":["this is info and is level 6"],"levelNumber":6,"levelName":"info","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.990Z","args":["this is debug and is level 7"],"levelNumber":7,"levelName":"debug","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.991Z","args":["this is emerg and is level 0"],"levelNumber":0,"levelName":"emergency","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.991Z","args":["this is crit and is level 2"],"levelNumber":2,"levelName":"critical","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is err and is level 3"],"levelNumber":3,"levelName":"error","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is warn and is level 4"],"levelNumber":4,"levelName":"warning","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.992Z","args":["this is note and is level 5"],"levelNumber":5,"levelName":"notice","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.993Z","args":["this is default and is level 6"],"levelNumber":6,"levelName":"info","line":"89","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}',
			'{"date":"2013-05-07T11:12:43.995Z","args":["this is unknown and is level 6"],"levelNumber":6,"levelName":"info","line":"91","method":"Task.fn","file":"/Users/balupton/Projects/caterpillar/out/test/caterpillar-test.js"}'
		]

		output.on('data', function (chunk) {
			actual.push(chunk.toString())
		})

		it('should pipe correctly', function () {
			logger.pipe(output)
		})

		it('should log messages', function () {
			const levels = logger.getConfig().levels
			for ( const name in levels ) {
				if ( levels.hasOwnProperty(name) ) {
					const number = levels[name]
					const message = `this is ${name} and is level ${number}`
					logger.log(name, message)
				}
			}
			logger.log('this is unknown and is level 6')
		})

		it('should provide the expected output', function (done) {
			output.on('end', function () {
				const actualCleaned = actual.map(cleanChanging)
				const expectedCleaned = expected.map(cleanChanging)
				console.dir(actualCleaned)
				console.dir(expectedCleaned)
				equal(actualCleaned.length, expectedCleaned.length, 'lengths')
				actualCleaned.forEach(function (result, index) {
					deepEqual(result, expectedCleaned[index], 'results')
				})
				done()
			})
			logger.end()
		})
	})
})
