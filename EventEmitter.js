export class EventEmitter {
	constructor() {
		this.listeners = new Map();
	}

	on(name, callback) {
		if (!this.listeners.has(name)) this.listeners.set(name, []);
		this.listeners.get(name).push(callback);
		return this;
	}

	once(name, callback) {
		let fired = false;
		const listener = (...args) => {
			if (fired) return;
			fired = true;
			this.off(name, listener);
			callback.apply(this, args);
		};
		listener.originalCallback = callback;
		return this.on(name, listener);
	}

	off(name, callback) {
		if (!this.listeners.has(name)) return this;
		const remaining = this.listeners.get(name).filter(listener => listener !== callback && listener.originalCallback !== callback);
		if (remaining.length) this.listeners.set(name, remaining);
		else this.listeners.delete(name);
		return this;
	}

	emit(name, ...args) {
		if (!this.listeners.has(name)) return false;
		for (const listener of [...this.listeners.get(name)]) listener.apply(this, args);
		return true;
	}

	removeAllListeners(name) {
		if (name === undefined) this.listeners.clear();
		else this.listeners.delete(name);
		return this;
	}
}
