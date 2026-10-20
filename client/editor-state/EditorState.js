import { EJSON } from 'meteor/ejson';
import { useEffect, useMemo } from 'react';
import { Bus, useBus } from '../util/bus.js';
import { updateObject } from '../../imports/update-object.js';

const identity = (doc = {}) => doc;

export class EditorState {
	constructor({importFn, exportFn, pathFor}) {
		this.bus = new Bus(null);
		this.initialState = null;
		this.initialDraft = {};
		this.importFn = importFn || identity;
		this.exportFn = exportFn || identity;
		this.pathFor = pathFor;
	}

	use = () => useBus(this.bus);

	useInit(doc, onChange) {
		const initialState = useMemo(() => EJSON.clone(this.importFn(doc || undefined)), [JSON.stringify(doc || undefined)]);
		const state = this.use();
		const draft = useMemo(() => {
			if (!state) return null;
			const draft = this.export(state);
			return doc && EJSON.equals(this.initialDraft, draft) ? null : draft;
		}, [state, Boolean(doc)]);
		useEffect(() => () => this.reset(), [doc ? doc._id : undefined]);
		useEffect(() => {
			const current = this.bus.state;
			const incomingDraft = this.export(initialState);
			if (current && this.initialState && !EJSON.equals(current, this.initialState)) {
				if (!incomingDraft || !EJSON.equals(this.export(current), incomingDraft)) return;
			}
			this.initialState = initialState;
			this.initialDraft = incomingDraft;
			this.bus.update(initialState);
		}, [initialState, state]);
		useEffect(() => {
			if (onChange) onChange(draft);
		}, [draft, onChange]);
		return state || initialState;
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

	reset = () => {
		this.initialState = null;
		this.initialDraft = {};
		this.bus.update(null);
	};
}
