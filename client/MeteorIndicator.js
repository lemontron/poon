import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { ConnectionIndicator } from './ConnectionIndicator';

export const MeteorIndicator = () => {
	const status = useTracker(() => {
		const busy = Meteor.loggingIn && Meteor.loggingIn();
		if (busy) return 'connected';
		return Meteor.status().status;
	}, []);
	return <ConnectionIndicator status={status}/>;
};
