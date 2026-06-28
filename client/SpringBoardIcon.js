import React, { useRef } from 'react';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { setRevealOrigin } from './Reveal';

export const SpringBoardIcon = ({title, icon, href, color, ImageComponent}) => {
	const frameRef = useRef(null);

	const setOrigin = () => {
		const rect = frameRef.current.getBoundingClientRect();
		setRevealOrigin(rect);
	};

	const renderIcon = () => {
		if (ImageComponent) return ImageComponent;
		if (icon) return <Icon icon={icon}/>;
	};

	return (
		<Touchable href={href} className="springboard-icon" onClick={setOrigin}>
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