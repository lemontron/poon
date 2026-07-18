import React, { useContext, useEffect, useRef } from 'react';
import { useAnimation } from './util/animation';
import { clamp } from './util';
import { Pan } from './Pan';
import { ViewPagerContext } from './ViewPagerContext';

const PAN_EDGE_EPSILON = 0.5;

export const GalleryItem = ({children}) => {
	const el = useRef(null);
	const anim = useAnimation({zoom: 1, panX: 0, panY: 0});
	const pager = useContext(ViewPagerContext);

	useEffect(() => {
		return anim.on(val => {
			el.current.style.transform = `scale(${val.zoom}) translateX(${val.panX / val.zoom}px) translateY(${val.panY / val.zoom}px)`;
		});
	}, []);

	useEffect(() => {
		if (!pager || pager.pageIndex === pager.currentPage) return;
		anim.spring({'zoom': 1, 'panX': 0, 'panY': 0});
	}, [pager?.pageIndex, pager?.currentPage]);

	const getLimits = (zoom = anim.values.zoom) => {
		const img = el.current.querySelector('img');

		// console.log('Zoomed:', img.clientHeight * anim.values.zoom, 'Regular:', img.clientHeight);

		const width = (img.clientWidth * zoom);
		const height = (img.clientHeight * zoom);

		return {
			'maxPanX': (width > el.current.clientWidth) ? ((width - el.current.clientWidth) / 2) : 0,
			'maxPanY': (height > el.current.clientHeight) ? ((height - el.current.clientHeight) / 2) : 0,
		};
	};

	const canPan = (distance, value, max) => {
		if (!max) return false;
		const nextValue = clamp(value + distance, -max, max);
		return Math.abs(nextValue - value) > PAN_EDGE_EPSILON;
	};

	const getViewportRect = () => {
		return (el.current.parentElement || el.current).getBoundingClientRect();
	};

	return (
		<Pan
			className="gallery-item"
			ref={el}
			children={children}
			onCapture={(e) => {
				const {maxPanX, maxPanY} = getLimits();
				if (e.pinch) return true;
				if (e.direction === 'x') return canPan(e.distance, anim.values.panX, maxPanX);
				if (e.direction === 'y') return canPan(e.distance, anim.values.panY, maxPanY);
			}}
			onDown={() => anim.end()}
			onPinch={(e) => {
				// console.log('Pinch:', anim.initialValues.zoom, e.scale);
				const zoom = (anim.initialValues.zoom * e.scale);
				const {maxPanX, maxPanY} = getLimits(zoom);
				const rect = getViewportRect();
				const initialPinchX = e.initialCenter.x - (rect.left + (rect.width / 2));
				const initialPinchY = e.initialCenter.y - (rect.top + (rect.height / 2));
				const pinchX = e.center.x - (rect.left + (rect.width / 2));
				const pinchY = e.center.y - (rect.top + (rect.height / 2));
				const scale = zoom / anim.initialValues.zoom;
				anim.set({
					'zoom': zoom,
					'panX': clamp(pinchX - ((initialPinchX - anim.initialValues.panX) * scale), -maxPanX, maxPanX),
					'panY': clamp(pinchY - ((initialPinchY - anim.initialValues.panY) * scale), -maxPanY, maxPanY),
				}, false);
			}}
			onMove={(e) => {
				if (anim.values.zoom <= 1) return;
				const {maxPanX, maxPanY} = getLimits();
				anim.set({
					'panX': maxPanX && clamp(anim.initialValues.panX + e.d.x, -maxPanX, maxPanX),
					'panY': maxPanY && clamp(anim.initialValues.panY + e.d.y, -maxPanY, maxPanY),
				}, false);
			}}
			onUp={() => {
				if (anim.values.zoom < 1) return anim.spring({'zoom': 1, 'panX': 0, 'panY': 0});
				if (anim.values.zoom > 3) {
					const {maxPanX, maxPanY} = getLimits(3);
					return anim.spring({
						'zoom': 3,
						'panX': clamp(anim.values.panX, -maxPanX, maxPanX),
						'panY': clamp(anim.values.panY, -maxPanY, maxPanY),
					});
				}
				anim.end();
			}}
			onDoubleTap={() => {
				if (anim.values.zoom === 1) {
					anim.spring({'zoom': 3});
				} else {
					anim.spring({'zoom': 1, 'panX': 0, 'panY': 0});
				}
			}}
		/>
	);
};
