import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { navigation } from 'meteor/poon-router';
import { useAnimatedValue } from './util/animated';
import { c, clamp, lerp } from './util';
import { ScreenHeader } from './ScreenHeader';
import { Pan } from './Pan';
import { Layer } from './Layer';

let pendingConfig = {};

export const Reveal = ({
	presentation = 'reveal',
	children,
	title,
	headerRight,
	isVisible,
	animateIn,
	className,
	SearchComponent,
	BackgroundComponent,
	theme,
	ref,
}) => {
	const layerEl = useRef();
	const innerEl = useRef();
	const pan = useAnimatedValue(animateIn ? 0 : 1);

	const config = useMemo(() => { // consume pending config
		const config = pendingConfig;
		pendingConfig = {};
		return config;
	}, []);

	// console.log('Config:', config);

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
			val = clamp(val, 0, 1);

			const originLeft = config.left || (window.innerWidth / 2);
			const originTop = config.top || (window.innerHeight / 2);
			const originWidth = config.width || 50;
			const originHeight = config.height || 50;
			const top = lerp(val, originTop, 0);
			const right = lerp(val, vw - originLeft - originWidth, 0);
			const bottom = lerp(val, vh - originTop - originHeight, 0);
			const left = lerp(val, originLeft, 0);

			const clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${lerp(val, 50, 0)}px)`;

			layerEl.current.style.clipPath = clipPath;
			layerEl.current.style.webkitClipPath = clipPath;
			layerEl.current.style.backgroundColor = config.color || '';
			layerEl.current.style.display = val ? 'flex' : 'none';
			innerEl.current.style.opacity = val;
		});
	}, [config, pan]);

	return (
		<Layer isActive={isVisible} className={c('reveal', className)} ref={layerEl} theme={theme}>
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
					presentation={presentation}
					SearchComponent={SearchComponent}
				/>
				<div className="card-body" children={children}/>
			</Pan>
		</Layer>
	);
};

export const setRevealOrigin = (el) => {
	const rect = el.getBoundingClientRect();
	const style = getComputedStyle(el);
	pendingConfig = {
		'left': rect.left,
		'top': rect.top,
		'width': rect.width,
		'height': rect.height,
		'color': style.backgroundColor,
	};
	console.log(pendingConfig);
};
