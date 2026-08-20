import React from 'react';
import { VStack } from './Stack';
import { ActivityIndicator } from './ActivityIndicator';

export const Loading = ({debugMessage}) => (
	<VStack align="center" justify="center" padding frame>
		<ActivityIndicator/>
		{Meteor.isDevelopment ? <div>{debugMessage}</div> : null}
	</VStack>
);