import React from 'react';
import { c } from './util';
import { Icon } from './Icon.js';

export const Avatar = ({
	item,
	className,
	variant,
	getUrl = val => val,
	name,
	statusColor,
}) => {
	const url = getUrl(item, variant);
	return (
		<div className={c('avatar', className)} title={name}>
			{url ? (
				<img draggable={false} src={url} alt={name}/>
			) : null}
			{statusColor ? (
				<Icon icon="circle" className="badge" color={statusColor}/>
			) : null}
		</div>
	);
};