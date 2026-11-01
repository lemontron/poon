import React from 'react';
import { c } from './util';
import { HeaderSecondaryProvider } from './HeaderSecondary';

export const Layer = ({isActive = true, className, children, ref, theme}) => (
	<HeaderSecondaryProvider>
		<div
			className={c('layer', className, !isActive && 'layer-inactive', theme && `themed theme-${theme}`)}
			children={children}
			ref={ref}
		/>
	</HeaderSecondaryProvider>
);
