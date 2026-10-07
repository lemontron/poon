import React, { useEffect, useRef } from 'react';
import { Fab } from '../Fab.js';
import { useMobile } from '../util';

export const FabLayout = ({
	FabComponent,
	icon = 'add',
	title,
	href,
	onClick,
	disabled,
	children,
	pan,
	color,
	pulse,
}) => {
	const container = useRef();
	const mobile = useMobile();

	useEffect(() => {
		if (mobile && pan && container.current) return pan.on(val => {
			container.current.style.transform = `translateY(-${val}px)`;
		});
	}, [pan, mobile]);

	const renderFab = () => {
		if (href || onClick) return (
			<Fab
				title={title}
				icon={icon}
				href={href}
				onClick={onClick}
				disabled={disabled}
				color={color}
				pulse={pulse}
			/>
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
