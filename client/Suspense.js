import React from 'react';
import { VStack } from './Stack';
import { ActivityIndicator } from './ActivityIndicator';

export const Loading = ({status}) => (
	<VStack align="center" justify="center" padding frame>
		<ActivityIndicator/>
		{Meteor.isDevelopment ? <div>{status}</div> : null}
	</VStack>
);