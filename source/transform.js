/* @flow */
import {Transform as _Transform} from 'stream'
import {deep} from 'extendr'

// Transform
export class Transform extends _Transform {
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
			this.setConfig(config)
		}
	}

	_transform (chunk /* :Buffer|string */, encoding /* :string */, next /* :function */ ) /* :void */ {
		const entry = JSON.parse(chunk.toString())
		let message = this.format(entry)
		if ( message ) {
			message = JSON.stringify(message)
		}
		next(null, message)
	}

	format (entry /* :Object */ ) /* :Object */ {
		return entry
	}
}
