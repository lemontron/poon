import React from 'react';
import { VStack } from './Stack';
import { ActivityIndicator } from './ActivityIndicator';

export const Loading = () => (
	<VStack align="center" justify="center" padding frame>
		<ActivityIndicator/>
	</VStack>
);