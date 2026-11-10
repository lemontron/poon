import { EJSON } from 'meteor/ejson';
import { Meteor } from 'meteor/meteor';

const decode = value => {
	try {
		return EJSON.parse(value);
	} catch (err) {
		return value;
	}
};

const encode = value => {
	if (typeof value !== 'string') value = EJSON.stringify(value);
	return value;
};

export const Storage = new Proxy(Meteor._localStorage, {
	get: (target, key) => {
		return decode(target.getItem(key));
	},
	set: (target, key, value) => {
		target.setItem(key, encode(value));
		return true;
	},
});
