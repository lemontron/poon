import { WebAppInternals } from 'meteor/webapp';

const materialSymbolsLink = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols&display=block">';

WebAppInternals.registerBoilerplateDataCallback('poon-material-symbols', (request, data) => {
	const head = data.head || '';
	if (head.includes(materialSymbolsLink)) return false;
	data.head = `${head}${materialSymbolsLink}\n`;
	return true;
});
