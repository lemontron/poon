import React, { useEffect, useRef } from 'react';
import { c } from './util';
import { useSize } from './util/size';
import { Pan } from './Pan';
import { Layer } from './Layer';
import { Button, HStack } from 'meteor/poon';

export const BottomSheet = ({
	title,
	className,
	visible,
	pan,
	children,
	onClose,
	onPress,
	showShade = true,
	showHandle,
	showCloseButton,
}) => {
	const shadeEl = useRef();
	const sheetEl = useRef();
	const {height} = useSize(sheetEl);

	const close = () => pan.spring(0).then(onClose);

	useEffect(() => {
		if (!height) return;
		return pan.on(value => {
			sheetEl.current.style.transform = `translateY(-${value}px)`;
			if (shadeEl.current) shadeEl.current.style.opacity = (value / height);
		});
	}, [height]);

	useEffect(() => {
		if (!height) return;
		if (visible) { // show
			pan.spring(height);
		} else { // hide
			pan.spring(0).then(onClose);
		}
	}, [visible, !!height, onClose]);

	const hasHeader = showCloseButton || title;

	return (
		<Layer isActive={false}>
			{visible && showShade ? <div className="shade shade-bottom-sheet" ref={shadeEl} onClick={close}/> : null}
			<div className="sheet-container">
				<Pan
					direction="y"
					ref={sheetEl}
					className={c('sheet', className)}
					onClick={onPress}
					onCapture={e => {
						return (e.direction === 'y');
					}}
					onMove={(e) => {
						pan.setValue(e.size - Math.max(e.distance / 100, e.distance));
					}}
					onUp={e => {
						if (e.flick === -1) return pan.spring(0, e.flickMs).then(onClose);
						pan.spring(e.size);
					}}
				>
					{showHandle ? <div className="handle"/> : null}
					{hasHeader ? (
						<HStack className="sheet-header" align="center" justify="between" padding>
							<div>{title}</div>
							{showCloseButton ? <Button icon="close" round color="glass" onClick={close}/> : null}
						</HStack>
					) : null}
					{children}
				</Pan>
			</div>
		</Layer>
	);
};