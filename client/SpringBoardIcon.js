import React, { useRef } from 'react';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { setRevealOrigin } from './Reveal';

export const SpringBoardIcon = ({title = 'Icon', icon = 'circle', href, color, IconComponent, disabled}) => {
	const el = useRef();

	const setOrigin = () => {
		setRevealOrigin(el.current);
	};

	return (
		<Touchable href={href} className="springboard-icon" onClick={setOrigin} disabled={disabled}>
			{IconComponent || (
				<div
					ref={el}
					className="icon-frame"
					style={{backgroundColor: color}}
					children={<Icon icon={icon}/>}
				/>
			)}
			<div className="springboard-icon-name">{title}</div>
		</Touchable>
	);
};
