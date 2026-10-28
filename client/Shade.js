import React, { useRef, useImperativeHandle } from 'react';

export const Shade = ({ref}) => {
	const el = useRef();

	useImperativeHandle(ref, () => ({
		progress: (value) => {
			if (el.current) el.current.style.opacity = value;
		},
	}));

	return <div className="shade" ref={el}/>;
};