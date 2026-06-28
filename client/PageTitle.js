import React from 'react';
import { HStack, VStack } from './Stack.js';

export const PageTitle = ({LeftComponent, RightComponent, title, subtitle}) => {
	return (
		<HStack spacing align="center" className="page-title">
			{LeftComponent}
			<VStack frame justify="center">
				<h1>{title}</h1>
				{subtitle ? (<h2>{subtitle}</h2>) : null}
			</VStack>
			{RightComponent}
		</HStack>
	);
};
