export const showOpenFilePicker = (accept = {}, capture, multiple) => new Promise((resolve) => {
	const input = document.createElement('input');
	let focusTimeout;
	const cleanup = () => {
		window.removeEventListener('focus', handleFocus);
		clearTimeout(focusTimeout);
		input.remove();
	};
	const handleFocus = () => {
		focusTimeout = setTimeout(() => {
			if (!input.files.length) {
				cleanup();
				resolve(null);
			}
		}, 500);
	};
	input.type = 'file';
	input.multiple = Boolean(multiple);
	input.style.display = 'none';
	if (accept) input.accept = Array.isArray(accept) ? accept.join(',') : accept;
	if (capture) input.capture = capture;
	input.onchange = () => {
		const file = multiple ? [...input.files] : (input.files[0] || null);
		cleanup();
		resolve(Array.isArray(file) && file.length === 0 ? null : file);
	};
	window.addEventListener('focus', handleFocus);
	document.body.appendChild(input);
	input.click();
});

export const convertFileAsync = (file, returnFormat = 'base64') => new Promise((resolve, reject) => {
	if (returnFormat === 'file') return resolve(file);
	const reader = new FileReader();
	reader.onload = () => {
		if (returnFormat === 'base64') return resolve(reader.result.split(',')[1]);
		resolve(reader.result);
	};
	reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
	if (returnFormat === 'arrayBuffer') return reader.readAsArrayBuffer(file);
	if (returnFormat === 'text') return reader.readAsText(file);
	reader.readAsDataURL(file);
});

export const selectFileAsync = async ({accept, capture, multiple, returnFormat = 'base64'}) => {
	const file = await showOpenFilePicker(accept, capture, multiple);
	if (Array.isArray(file)) return Promise.all(file.map(item => convertFileAsync(item, returnFormat)));
	if (file) return convertFileAsync(file, returnFormat);
};
