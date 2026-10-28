import React from 'react';
import { useMobile } from '../util';
import { ScrollView } from '../ScrollView';
import { HStack, VStack } from '../Stack';
import { FabLayout } from './FabLayout';

export const SidebarLayout = ({
	TopComponent,
	MainComponent,
	SidebarComponent,
	BottomComponent,
	FabComponent,
	pan,
	showSidebar = 'desktop',
	sidebarTheme,
}) => {
	const mobile = useMobile();

	if (mobile) {
		const renderSidebar = () => {
			if (showSidebar === 'always') return (
				<VStack
					theme={sidebarTheme}
					className="sidebar-layout-sidebar"
					children={SidebarComponent}
				/>
			);
		};

		return (
			<VStack frame>
				{TopComponent}
				<FabLayout FabComponent={FabComponent} pan={pan}>
					<ScrollView frame>
						<VStack spacing frame>
							{SidebarComponent && renderSidebar()}
							{MainComponent}
						</VStack>
					</ScrollView>
				</FabLayout>
				{BottomComponent}
			</VStack>
		);
	}

	const renderSidebar = () => (
		<VStack
			theme={sidebarTheme}
			className="sidebar-layout-sidebar"
			children={SidebarComponent}
		/>
	);

	return (
		<VStack frame spacing>
			{TopComponent}
			<HStack frame className="sidebar-layout">
				{SidebarComponent && renderSidebar()}
				<VStack frame>
					<FabLayout FabComponent={FabComponent}>
						{MainComponent}
					</FabLayout>
					{BottomComponent}
				</VStack>
			</HStack>
		</VStack>
	);
};
