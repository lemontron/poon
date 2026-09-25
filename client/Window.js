import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { navigation } from 'meteor/poon-router';
import { useAnimatedValue } from './util/animated';
import { useSize } from './util/size';
import { ScreenHeader } from './ScreenHeader';
import { Pan } from './Pan';
import { c } from './util';
import { Layer } from './Layer';
import { ErrorBoundary } from './ErrorBoundary';

export const Window = ({
	children,
	title,
	headerRight,
	onClose,
	onBeforeClose,
	isVisible,
	presentation = 'modal',
	className,
	theme,
	SearchComponent,
	ref,
}) => {
	const shadeEl = useRef();
	const el = useRef();
	const pan = useAnimatedValue(0);

	const close = async () => {
		pan.spring(0).then(() => {
			if (onClose) onClose();
			navigation.goBack();
		});
	};

	useImperativeHandle(ref, () => ({
		close,
	}));

	const {height} = useSize(el);

	useEffect(() => {
		if (!height) return;

		if (isVisible) {
			pan.spring(height);
		} else {
			pan.spring(0);
		}
	}, [isVisible, height]);

	useEffect(() => {
		// const cards = document.querySelectorAll('.card, .window');
		return pan.on(value => {
			// const percent = (value / height);
			if (el.current) el.current.style.transform = `translateY(-${value}px)`;
			if (shadeEl.current) {
				shadeEl.current.style.display = value ? 'block' : 'none';
				shadeEl.current.style.opacity = (value / height);
			}
			// [...cards].filter(r => r !== el.current).forEach((el, i, all) => {
			// 	console.log('Index:', i, 'Class:', el.className, 'Depth:');
			// 	const depthScale = (all.length - i) * .04;
			// 	el.parentElement.style.transform = `scale(${1 - ((percent * 0.04) + (depthScale * percent))})`;
			// });
		});
	}, [height]);

	return (
		<Layer isActive={isVisible} className={c(`layer-${presentation}`)} theme={theme}>
			<div className="shade" ref={shadeEl}/>
			<Pan
				direction="y"
				className={c(`window window-${presentation}`, className)}
				ref={el}
				onCapture={e => {
					return (e.direction === 'y' && e.distance > 0);
				}}
				onMove={e => {
					pan.setValue(height - Math.max(0, e.distance));
				}}
				onUp={e => {
					if (e.flick === -1) return close();
					pan.spring(e.size);
				}}
			>
				{presentation === 'modal' ? (
					<ScreenHeader
						title={title}
						presentation="modal"
						onClose={close}
						onBeforeClose={onBeforeClose}
						headerRight={headerRight}
						SearchComponent={SearchComponent}
					/>
				) : null}
				<div className="card-body">
					<ErrorBoundary>
						{children}
					</ErrorBoundary>
				</div>
			</Pan>
		</Layer>
	);
};
