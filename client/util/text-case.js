export const applyTextCase = (value, textCase) => {
	if (textCase === 'upper') return value.toUpperCase();
	if (textCase === 'lower') return value.toLowerCase();
	if (textCase === 'title') return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	return value;
};
