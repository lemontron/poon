import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { navigation } from 'meteor/poon-router';
import { useAnimatedValue } from './util/animated';
import { useSize } from './util/size';
import { CardLayout } from './CardLayout';
import { Pan } from './Pan';
import { c } from './util';
import { Layer } from './Layer';

export const Window = ({
	children,
	title,
	headerRight,
	headerLeft,
	onClose,
	onBeforeClose,
	isVisible,
	presentation = 'window',
	className,
	theme,
	SearchComponent,
	SidebarComponent,
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
		return pan.on(value => {
			if (el.current) el.current.style.transform = `translateY(-${value}px)`;
			if (shadeEl.current) {
				shadeEl.current.style.display = value ? 'block' : 'none';
				shadeEl.current.style.opacity = (value / height);
			}
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
				<CardLayout
					title={title}
					presentation={presentation}
					onClose={close}
					onBeforeClose={onBeforeClose}
					headerLeft={headerLeft}
					headerRight={headerRight}
					SearchComponent={SearchComponent}
					SidebarComponent={SidebarComponent}
					children={children}
				/>
			</Pan>
		</Layer>
	);
};
