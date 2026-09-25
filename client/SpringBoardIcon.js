import React, { useRef } from 'react';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { setRevealOrigin } from './Reveal';

export const SpringBoardIcon = ({title = 'Icon', icon = 'circle', href, color, ImageComponent, disabled}) => {
	const el = useRef();

	const setOrigin = () => {
		setRevealOrigin(el.current);
	};

	const renderIcon = () => {
		if (ImageComponent) return ImageComponent;
		if (icon) return <Icon icon={icon}/>;
	};

	return (
		<Touchable href={href} className="springboard-icon" onClick={setOrigin} disabled={disabled}>
			<div
				ref={el}
				className="icon-frame"
				style={{background: color}}
				children={renderIcon()}
			/>
			<div className="springboard-icon-name">{title}</div>
		</Touchable>
	);
};
