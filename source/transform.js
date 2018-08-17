/* eslint class-methods-use-this:0 */
'use strict'

const { deep } = require('extendr')
const _Transform = require('stream').Transform

/**
 * Transform.
 * This is a helper for our transforms to be able to process the written log data more easily.
 * All the need to do is extend this class and add their own `format` method.
 *
 * @param {...*} args forwarded to {@link Logger#setConfig}
 * @extends stream.Transform
 *
 * @example
 * class Pretty extends require('caterpillar').Transform {
 * 	format (entry) {
 * 		return require('util').inspect(entry, {colors: true})
 * 	}
 * }
 * require('caterpillar').create()
 * 	.pipe(Pretty.create())
 * 	.pipe(process.stdout)
 * 	.log('note', 'cool times', 5)
 */
class Transform extends _Transform {
	constructor (...args) {
		super(...args)

		/**
		 * Internal configuration object
		 * @type {Object}
		 * @private
		 */
		this._config = this.getInitialConfig()

		this.setConfig(...args)
	}

	// ===================================
	// Generic Differences
	// This code is shared but different between Logger and Transform

	/**
	 * Get the initial configuration option.
	 * Use this to add default/initial configuration to your class.
	 * @returns {Object}
	 */
	getInitialConfig () {
		return {}
	}

	/**
	 * Alternative way of creating an instance of the class without having to use the `new` keyword.
	 * Useful when creating the class directly from `require` statements.
	 * @static
	 * @param {...*} args
	 * @returns {Transform}
	 */
	static create (...args) {
		return new this(...args)
	}

	// ===================================
	// Generic
	// This code is shared between Logger and Transform

	/**
	 * Get the current configuration object for this instance.
	 * @returns {Object}
	 */
	getConfig () {
		return this._config
	}

	/**
	 * Apply the specified configurations to this instance's configuration via deep merging.
	 * @param {...Array<Object>} configs
	 * @returns {this}
	 *
	 * @example
	 * setConfig({a: 1}, {b: 2})
	 * getConfig()  // {a: 1, b: 2}
	 */
	setConfig (...configs) {
		deep(this._config, ...configs)
		this.emit('config', ...configs)
		return this
	}

	/**
	 * Pipe this data to some other writable stream.
	 * If the child stream also has a `setConfig` method, we will ensure the childs configuration is kept consistent with parents.
	 * @param {stream.Writable} child stream to be piped to
	 * @returns {stream.Writable} the result of the pipe operation
	 */
	pipe (child) {
		if (child.setConfig) {
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
	 * @param {Buffer|string} chunk
	 * @param {string} encoding
	 * @param {function} next
	 * @returns {void}
	 */
	_transform (chunk, encoding, next) {
		let message = chunk.toString()

		try {
			message = this.format(message)
		}
		catch (err) {
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
	 * @param {string} message
	 * @returns {*}
	 */
	format (message) {
		return message
	}
}

// Export
module.exports = Transform
