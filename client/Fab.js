import React from 'react';
import { Touchable } from './Touchable';
import { c } from './util';
import { Icon } from './Icon';
import { ActivityIndicator } from './ActivityIndicator';

export const Fab = ({icon, title, loading, disabled, active, href, detail, onClick, color, pulse}) => (
	<Touchable
		className={c('fab', !title && 'round', loading && 'loading', color && `fab-${color}`, pulse && !disabled && !loading && 'pulse')}
		loading={loading}
		disabled={disabled}
		active={active}
		onClick={onClick}
		href={href}
	>
		{pulse ? <span className="fab-halo" aria-hidden="true"><span/></span> : null}
		<div className="fab-content">
			<div className="fab-body">
				<Icon icon={icon}/>
				{title && <div className="fab-title">{title}</div>}
			</div>
			{detail ? <div className="fab-detail">{detail}</div> : null}
		</div>
		{loading ? <ActivityIndicator color="var(--bg-primary)"/> : null}
	</Touchable>
);
