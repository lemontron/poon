import React from 'react';
import { c } from './util';
import { Touchable } from './Touchable';
import { Icon } from './Icon';

export const HeaderButton = ({icon, title, badge, children, className, ...props}) => (
	<Touchable className={c('header-button center', className)} {...props}>
		{children}
		{icon ? <Icon icon={icon}/> : null}
		{title ? <span>{title}</span> : null}
		{badge ? <span className="badge">{badge}</span> : null}
	</Touchable>
);
