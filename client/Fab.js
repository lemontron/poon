import React, { useEffect, useRef } from 'react';
import { Touchable } from './Touchable';
import { c } from './util';
import { Icon } from './Icon';
import { ActivityIndicator } from './ActivityIndicator';

export const Fab = ({icon, title, loading, disabled, active, href, detail, onClick}) => (
	<Touchable
		className={c('fab', !title && 'round', loading && 'loading')}
		loading={loading}
		disabled={disabled}
		active={active}
		onClick={onClick}
		href={href}
	>
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