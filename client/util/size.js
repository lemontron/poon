import { useEffect, useState } from 'react';

export const getSize = (el) => {
	if (!el) return {};
	return {'width': Math.round(el.clientWidth), 'height': Math.round(el.clientHeight)};
};

export const useSize = (el) => {
	const [size, setSize] = useState(getSize(el.current));
	useEffect(() => { // Observe size of element
		if (!el.current) return;
		const ro = new ResizeObserver(entries => {
			const e = entries[0].borderBoxSize[0];
			setSize({'height': Math.round(e.blockSize), 'width': Math.round(e.inlineSize)});
		});
		ro.observe(el.current);
		return ro.disconnect.bind(ro);
	}, []);
	return size;
};
