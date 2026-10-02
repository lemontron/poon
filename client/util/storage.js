import { EJSON } from 'meteor/ejson';

export const storage = new Proxy(localStorage, {
	get: (target, key) => key in target ? EJSON.parse(target[key]) : null,
	set: (target, key, value) => {
		target.setItem(key, EJSON.stringify(value));
		return true;
	},
});
