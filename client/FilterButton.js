import React from 'react';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { CheckBox } from './CheckBox';

export const FilterButton = ({
	title,
	LeftComponent,
	caret = true,
	checked,
	disabled,
	active,
	href,
	onClick,
}) => (
	<Touchable className="filter-button" onClick={onClick} active={active}  href={href} disabled={disabled}>
		{LeftComponent}
		{title ? <div className="filter-button-title">{title}</div> : null}
		{caret ? (
			<Icon className="filter-button-caret" icon="expand_more"/>
		) : (
			<CheckBox active={checked}/>
		)}
	</Touchable>
);