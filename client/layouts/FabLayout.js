import React from 'react';
import { VStack, ZStack } from '../Stack.js';
import { Fab } from '../Fab.js';

export const FabLayout = ({FabComponent, icon = 'add', title, href, onClick, disabled, children}) => {
	const renderFab = () => {
		if (href || onClick) return (
			<Fab title={title} icon={icon} href={href} onClick={onClick} disabled={disabled}/>
		);
	};

	return (
		<ZStack frame>
			{children}
			<VStack className="fab-container" align="trailing" justify="trailing" passthrough>
				{FabComponent}
				{renderFab()}
			</VStack>
		</ZStack>
	);
};