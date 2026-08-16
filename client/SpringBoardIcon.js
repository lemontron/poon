import React, { useRef } from 'react';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { setRevealOrigin } from './Reveal';

export const SpringBoardIcon = ({title = "Icon", icon = "circle", href, color, ImageComponent, disabled}) => {
	const frameRef = useRef(null);

	const setOrigin = () => {
		const frame = frameRef.current;
		const rect = frame.getBoundingClientRect();
		const renderedColor = getComputedStyle(frame).backgroundColor;
		setRevealOrigin(rect, renderedColor);
	};

	const renderIcon = () => {
		if (ImageComponent) return ImageComponent;
		if (icon) return <Icon icon={icon}/>;
	};

	return (
		<Touchable href={href} className="springboard-icon" onClick={setOrigin} disabled={disabled}>
			<div
				ref={frameRef}
				className="icon-frame"
				style={{background: color}}
				children={renderIcon()}
			/>
			<div className="springboard-icon-name">{title}</div>
		</Touchable>
	);
};
