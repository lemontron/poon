import { EJSON } from 'meteor/ejson';
import { Meteor } from 'meteor/meteor';

export const storage = new Proxy(Meteor._localStorage, {
	get: (target, key) => {
		const value = target.getItem(key);
		return value === null ? null : EJSON.parse(value);
	},
	set: (target, key, value) => {
		target.setItem(key, EJSON.stringify(value));
		return true;
	},
});
