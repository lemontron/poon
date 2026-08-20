import React from 'react';
import { ConnectionIndicator } from './ConnectionIndicator';
import { useConnection } from './util/connection';

export const MeteorIndicator = () => {
	const status = useConnection();
	return <ConnectionIndicator status={status}/>;
};
