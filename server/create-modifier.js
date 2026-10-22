import { DiffSequence } from 'meteor/diff-sequence';

export const createModifier = (doc, original) => {
	const modifier = {$set: {}, $unset: {}};
	const fields = DiffSequence.makeChangedFields(doc, original);
	for (const field in fields) {
		if (fields[field] === undefined) {
			modifier.$unset[field] = 1;
		} else {
			modifier.$set[field] = fields[field];
		}
	}
	return modifier;
};