import React, { useEffect, useRef } from 'react';
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
		<div className="fab-layout">
			{children}
			<div className="fab-container" ref={container}>
				{FabComponent}
				{renderFab()}
			</div>
		</div>
	);
};