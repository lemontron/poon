import React from 'react';
import { useMobile } from '../util';
import { ScrollView } from '../ScrollView';
import { HStack, VStack } from '../Stack';
import { FabLayout } from './FabLayout';
import { Placeholder } from '../Placeholder';
import { Loading } from '../Suspense';

export const SidebarLayout = ({
	loading,
	TopComponent,
	MainComponent,
	placeholder,
	SidebarComponent,
	BottomComponent,
	FabComponent,
	pan,
	showSidebar = 'desktop',
	sidebarTheme,
}) => {
	const mobile = useMobile();

	const renderPlacholder = () => {
		if (loading) return <Loading/>;
		return <Placeholder title={placeholder || 'No Content'}/>;
	};

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
					<ScrollView frame safePadding>
						<VStack spacing>
							{SidebarComponent && renderSidebar()}
							{MainComponent || renderPlacholder()}
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
						{MainComponent ? (
							<ScrollView frame children={MainComponent}/>
						) : renderPlacholder()}
					</FabLayout>
					{BottomComponent}
				</VStack>
			</HStack>
		</VStack>
	);
};
