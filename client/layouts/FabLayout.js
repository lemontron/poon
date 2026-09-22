import React, { useEffect, useRef } from 'react';
import { VStack, ZStack } from '../Stack.js';
import { Fab } from '../Fab.js';

export const FabLayout = ({FabComponent, icon = 'add', title, href, onClick, disabled, children, pan}) => {
	const container = useRef();

	useEffect(() => {
		if (pan && container.current) return pan.on(val => {
			container.current.style.transform = `translateY(-${val}px)`;
		});
	}, [pan]);

	const renderFab = () => {
		if (href || onClick) return (
			<Fab title={title} icon={icon} href={href} onClick={onClick} disabled={disabled}/>
		);
	};

	return (
		<ZStack frame>
			{children}
			<VStack
				className="fab-container"
				align="trailing"
				justify="trailing"
				passthrough
				ref={container}
			>
				{FabComponent}
				{renderFab()}
			</VStack>
		</ZStack>
	);
};