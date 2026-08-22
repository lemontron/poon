import React from 'react';
import { Touchable } from './Touchable';
import { Icon } from './Icon';

export const Banner = ({icon, title, onClick, href, onClose, RightComponent}) => (
	<Touchable className="banner" onClick={onClick} href={href}>
		<div className="banner-body">
			{icon ? <Icon icon={icon}/> : null}
			{title}
		</div>
		{RightComponent}
		{onClose ? <Touchable children={<Icon icon="close"/>}/> : null}
	</Touchable>
);
