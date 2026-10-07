import React from 'react';
import { c } from './util';
import { Touchable } from './Touchable';
import { Icon } from './Icon';

export const HeaderButton = ({icon, title, badge, children, className, ...props}) => (
	<Touchable className={c('header-button center', title && 'header-text-button', className)} {...props}>
		{children}
		{icon && !title ? <Icon icon={icon}/> : null}
		{title ? <span className="header-button-title">{title}</span> : null}
		{badge ? <span className="badge">{badge}</span> : null}
	</Touchable>
);
