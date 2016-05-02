/* @flow */
const {deep} = require('extendr')
const _Transform = require('stream').Transform

/**
Transform.
This is a helper for our transforms to be able to process the written log data more easily.
All the need to do is extend this class and add their own `format` method.

@example
class Pretty extends require('caterpillar').Transform {
	format (entry) {
		return require('util').inspect(entry, {colors: true})
	}
}
require('caterpillar').create()
	.pipe(Pretty.create())
	.pipe(process.stdout)
	.log('note', 'cool times', 5)

@extends stream.Transform
*/
class Transform extends _Transform {

	/**
	Construct our Logger with the specified configuration.
	Configuration is applied via `setConfig`.
	@param {Object} [config]
	*/
	constructor (config /* :?Object */) {
		super(config)  // new stream.Transform([options])
		if ( config ) {
			this.setConfig(config)
		}
	}

	// ===================================
	// Generic
	// This code is shared between Logger and Transform

	/**
	Internal configuration object
	@private
	@property {Object} _config
	*/
	/* :: _config:Object; */

	/**
	Alternative constructor.
	Alternative way of creating an instance of the class without having to use the `new` keyword.
	Useful when creating the class directly from `require` statements.
	@static
	@param {...*} args
	@returns {Logger}
	*/
	static create (...args) {
		return new this(...args)
	}

	/**
	Get the current configuration object for this instance.
	@returns {Object}
	*/
	getConfig () /* :Object */ {
		// if ( this._parent ) return deep({}, this._parent.getConfig(), this._config)
		return this._config || {}
	}

	/**
	Apply the specified configurations to this instance's configuration via deep merging.
	@example
	setConfig({a: 1}, {b: 2})
	getConfig()  // {a: 1, b: 2}
	@param {...*} configs - As many configuration objects as you wish to merge
	@returns {this}
	*/
	setConfig (...configs /* :Array<Object> */ ) /* :this */ {
		this._config = deep(this.getConfig(), ...configs)
		this.emit('config', ...configs)
		return this
	}

	/**
	Pipe this data to some other writable stream.
	If the child stream also has a `setConfig` method, we will ensure the childs configuration is kept consistent with parents.
	@param {stream.Writable} child stream to be piped to
	@returns {stream.Writable} the result of the pipe operation
	*/
	pipe (child /* :Object */ ) /* :any */ {
		// child._parent = child
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

	/**
	Transform the written buffer into data we can format
	@private
	@param {Buffer|string} chunk
	@param {string} encoding
	@param {function} next
	@returns {undefined}
	*/
	_transform (chunk /* :Buffer|string */, encoding /* :string */, next /* :function */ ) /* :void */ {
		const entry = JSON.parse(chunk.toString())
		let message = this.format(entry)
		if ( message ) {
			message = JSON.stringify(message)
		}
		next(null, message)
	}

	/**
	Format the written data into whatever we want.
	Here is where our transformers work with the written data to enhance it.
	@param {Object} entry
	@returns {*}
	*/
	format (entry /* :Object */ ) /* :mixed */ {
		return entry
	}
}

// Export
module.exports = Transform
