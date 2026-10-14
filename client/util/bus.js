import { useSyncExternalStore } from 'react';

export class Bus {
	constructor(initState) {
		this.state = initState;
		this.listeners = [];
	}

	getSnapshot = () => this.state;

	update = val => {
		if (this.state === val) return;
		this.state = val;
		this.listeners.forEach(fn => fn(val));
	};

	on = cb => {
		this.listeners.push(cb);
		return () => this.listeners = this.listeners.filter(fn => fn !== cb);
	};
}

export const useBus = bus => useSyncExternalStore(bus.on, bus.getSnapshot);
