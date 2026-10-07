export { EventEmitter } from '../EventEmitter';
export { updateObject } from '../update-object.js';
export { addServiceWorkerSource } from './service-worker';

import { WebAppInternals } from 'meteor/webapp';

const materialSymbolsLink = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols:FILL@1&display=block">';

WebAppInternals.registerBoilerplateDataCallback('poon-material-symbols', (request, data) => {
	const head = data.head || '';
	if (head.includes(materialSymbolsLink)) return false;
	data.head = `${head}${materialSymbolsLink}\n`;
	return true;
});
