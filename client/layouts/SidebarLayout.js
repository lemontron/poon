import React, { useContext } from 'react';
// import { createPortal } from 'react-dom';
// import { CardSidebarContext } from '../CardSidebarContext';
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
	// const sidebarEl = useContext(CardSidebarContext);

	if (mobile) return (
		<VStack frame>
			{TopComponent}
			<FabLayout FabComponent={FabComponent} pan={pan}>
				<ScrollView frame>
					<VStack spacing>
						{showSidebar === 'always' ? (
							<div className="sidebar-layout-sidebar">
								{SidebarComponent}
							</div>
						) : null}
						{MainComponent}
					</VStack>
				</ScrollView>
			</FabLayout>
			{BottomComponent}
		</VStack>
	);

	const sidebar = SidebarComponent ? (
		<div className="sidebar-layout-sidebar">
			{SidebarComponent}
		</div>
	) : null;

	return (
		<VStack frame spacing>
			{TopComponent}
			<HStack frame className="sidebar-layout">
				{sidebar}
				{/*{sidebarEl === undefined ? sidebar : sidebarEl && createPortal(sidebar, sidebarEl)}*/}
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
