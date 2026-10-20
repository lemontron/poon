import { EJSON } from 'meteor/ejson';
import { LocalCollection, Minimongo } from 'meteor/minimongo';

const cleanModifier = modifier => modifier.$set ? {
	...modifier,
	$set: Object.fromEntries(Object.entries(modifier.$set).filter(([, value]) => value !== undefined)),
} : modifier;

export const updateObject = (doc, modifier, selector = {}) => {
	const match = new Minimongo.Matcher(selector, true).documentMatches(doc);
	if (!match.result) return doc;

	// Meteor clones the document and modifier before applying the update.
	const next = {...doc};
	LocalCollection._modify(next, cleanModifier(modifier), {arrayIndices: match.arrayIndices});
	return EJSON.equals(doc, next) ? doc : next;
};