import { EJSON } from 'meteor/ejson';
import { useEffect } from 'react';
import { Bus, useBus } from '../util/bus.js';
import { updateObject } from '../../update-object.js';

const identity = doc => doc;

export class EditorState {
	constructor({importFn, exportFn, pathFor}) {
		this.bus = new Bus(null);
		this.initialDraft = {};
		this.importFn = importFn || identity;
		this.exportFn = exportFn || identity;
		this.pathFor = pathFor;
	}

	use = () => {
		const state = useBus(this.bus);
		const draft = state ? this.export(state) : null;
		return [state, EJSON.equals(this.initialDraft, draft) ? null : draft];
	};

	useInit(doc) {
		useEffect(() => {
			if (doc) {
				const state = EJSON.clone(this.importFn(doc));
				this.initialDraft = this.export(state);
				this.bus.update(state);
			}
			return () => this.reset();
		}, [JSON.stringify(doc)]);

		return this.use();
	}

	update = (modifier) => this.updateWhere({}, modifier);

	updateWhere(selector, modifier) {
		this.bus.update(updateObject(this.bus.state, modifier, selector));
	}

	set(field, fn = x => x) {
		return value => {
			this.update({$set: {[field]: fn(value)}});
		};
	}

	export(doc) {
		try {
			return this.exportFn(doc);
		} catch (err) {
			console.warn(err);
			return null;
		}
	}

	path = (doc, prefix) => this.pathFor(doc, prefix);

	reset = () => this.bus.update(null);
}
