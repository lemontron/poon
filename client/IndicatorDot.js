import React from 'react';
import { Icon } from './Icon';

export const IndicatorDot = ({active}) => (
	<Icon icon="circle" color={active ? 'var(--accent)' : 'var(--error)'} size={16}/>
);
