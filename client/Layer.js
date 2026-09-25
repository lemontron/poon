import React from 'react';
import { c } from './util';

export const Layer = ({isActive = true, className, children, ref, theme}) => (
	<div
		className={c('layer', className, !isActive && 'layer-inactive', theme && `theme-${theme}`)}
		children={children}
		ref={ref}
	/>
);
