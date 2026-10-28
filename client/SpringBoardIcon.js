import React from 'react';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { setRevealOrigin } from './Reveal';

export const SpringBoardIcon = ({title = 'Icon', icon = 'circle', href, color, IconComponent, disabled}) => {
	const setOrigin = (e) => {
		setRevealOrigin(e.currentTarget.firstElementChild);
	};

	return (
		<Touchable href={href} className="springboard-icon" onClick={setOrigin} disabled={disabled}>
			{IconComponent || (
				<div
					className="icon-frame"
					style={{backgroundColor: color}}
					children={<Icon icon={icon}/>}
				/>
			)}
			<div className="springboard-icon-name">{title}</div>
		</Touchable>
	);
};
