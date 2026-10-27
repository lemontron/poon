import React from 'react';

export const Badge = ({badge}) => (
	<div
		className="badge"
		style={{backgroundColor: badge}}
		children={Number.isFinite(badge) ? badge : null}
	/>
);
