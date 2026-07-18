import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { navigation } from 'meteor/poon-router';
import { useAnimatedValue } from './util/animated';
import { c, lerp } from './util';
import { ScreenHeader } from './ScreenHeader';
import { Pan } from './Pan';
import { Layer } from './Layer';

let origin = {};

export const Reveal = ({
	children,
	title,
	headerRight,
	isVisible,
	animateIn,
	className,
	SearchComponent,
	BackgroundComponent,
	ref,
}) => {
	const layerEl = useRef();
	const innerEl = useRef();
	const pan = useAnimatedValue(animateIn ? 0 : 1);

	const close = () => navigation.goBack(1);

	useImperativeHandle(ref, () => ({
		close,
	}));

	useEffect(() => {
		if (isVisible) {
			if (!animateIn) return;
			pan.spring(1);
		} else {
			pan.spring(0);
		}
	}, [animateIn, isVisible, pan]);

	useEffect(() => {
		const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

		return pan.on(val => {
			if (val > 1) val = 1;
			if (val < 0) val = 0;

			const originLeft = origin.left || 0;
			const originTop = origin.top || 0;
			const originWidth = origin.width || 48;
			const originHeight = origin.height || 48;
			const top = lerp(val, originTop, 0);
			const right = lerp(val, vw - originLeft - originWidth, 0);
			const bottom = lerp(val, vh - originTop - originHeight, 0);
			const left = lerp(val, originLeft, 0);

			const clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${lerp(val, 48, 0)}px)`;

			layerEl.current.style.clipPath = clipPath;
			layerEl.current.style.webkitClipPath = clipPath;
			// layerEl.current.style.opacity = val;
			layerEl.current.style.display = val ? 'flex' : 'none';

			innerEl.current.style.opacity = val;
		});
	}, [pan]);

	return (
		<Layer isActive={isVisible} className={c('reveal', className)} ref={layerEl}>
			<Pan
				direction="x"
				className="card reveal-content"
				ref={innerEl}
				onCapture={(e) => {
					return (e.direction === 'x' && e.distance > 0);
				}}
				onMove={(e) => {
					pan.setValue(1 - (e.distance / e.size));
				}}
				onUp={(e) => {
					if (e.flick === -1) return close();
					pan.spring(1);
				}}
			>
				{BackgroundComponent}
				<ScreenHeader
					backIcon="apps"
					title={title}
					onClose={close}
					headerRight={headerRight}
					presentation="reveal"
					SearchComponent={SearchComponent}
				/>
				<div className="card-body" children={children}/>
			</Pan>
		</Layer>
	);
};

export const setRevealOrigin = (rect) => origin = rect;
