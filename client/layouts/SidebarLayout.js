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
	sidebarVisible = true,
	onDismissSidebar,
	pan,
	showSidebar = 'desktop',
}) => {
	const mobile = useMobile();

	if (mobile) return (
		<VStack frame>
			{TopComponent}
			<FabLayout FabComponent={FabComponent} pan={pan}>
				<ScrollView frame>
					<VStack spacing>
						{showSidebar === 'always' ? (
							<div className="sidebar-layout-sidebar">
								<div className="sidebar-layout-sidebar-content" children={SidebarComponent}/>
							</div>
						) : null}
						{MainComponent}
					</VStack>
				</ScrollView>
			</FabLayout>
			{BottomComponent}
		</VStack>
	);

	return (
		<VStack frame spacing>
			{TopComponent}
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
		</VStack>
	);
};