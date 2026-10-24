import React from 'react';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { c } from './util';

export const DropdownItem = ({title, checked, icon, target, onClick, href, replaceState, disabled, active}) => (
	<Touchable
		className={c('dropdown-item', icon === 'delete' && 'destructive')}
		onClick={onClick}
		disabled={disabled}
		active={active}
		target={target}
		href={href}
		replaceState={replaceState}
	>
		{checked ? (<Icon icon="check" className="dropdown-check"/>) : null}
		{icon ? (<Icon icon={icon}/>) : null}
		{title}
	</Touchable>
);