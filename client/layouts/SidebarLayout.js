import React from 'react';
import { useMobile } from '../util';
import { ScrollView } from '../ScrollView';
import { HStack, VStack } from '../Stack';
import { FabLayout } from './FabLayout';

export const SidebarLayout = ({
	MainComponent,
	SidebarComponent,
	BottomComponent,
	FabComponent,
	sidebarVisible = true,
	onDismissSidebar,
	pan,
}) => {
	const mobile = useMobile();

	if (mobile) return (
		<VStack frame>
			<FabLayout FabComponent={FabComponent} pan={pan}>
				<ScrollView frame>
					<VStack spacing>
						<div className="sidebar-layout-sidebar">
							<div className="sidebar-layout-sidebar-content" children={SidebarComponent}/>
						</div>
						{MainComponent}
					</VStack>
				</ScrollView>
			</FabLayout>
			{BottomComponent}
		</VStack>
	);

	return (
		<HStack frame className="sidebar-layout">
			{SidebarComponent ? (
				<div className="sidebar-layout-sidebar">
					<div className="sidebar-layout-sidebar-content">
						{SidebarComponent}
					</div>
				</div>
			) : null}
			<VStack frame>
				<FabLayout FabComponent={FabComponent}>
					<ScrollView
						className="sidebar-layout-main"
						onPointerDownCapture={sidebarVisible ? e => e.stopPropagation() : undefined}
						onClickCapture={sidebarVisible ? onDismissSidebar : undefined}
						children={MainComponent}
						frame
					/>
				</FabLayout>
				{BottomComponent}
			</VStack>
		</HStack>
	);
};