import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { CardSidebarContext } from '../CardSidebarContext';
import { useMobile } from '../util';
import { ScrollView } from '../ScrollView';
import { HStack, VStack } from '../Stack';
import { FabLayout } from './FabLayout';
import { HeaderButton } from '../HeaderButton';

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
	testRootSidebar,
}) => {
	const mobile = useMobile();
	const sidebar = useContext(CardSidebarContext);

	if (mobile) {
		const renderSidebar = () => {
			if (showSidebar === 'always') return (
				<div className="sidebar-layout-sidebar sheen" children={SidebarComponent}/>
			);

			const content = (
				<div
					className="sidebar-layout-sidebar sheen"
					ref={testRootSidebar && sidebar && sidebar.sidebarEl ? sidebar.setSidebarContentEl : undefined}
				>
					{testRootSidebar && sidebar && sidebar.sidebarEl ? (
						<HStack justify="leading">
							<HeaderButton icon="close" onClick={() => sidebar.setShowSidebar(false)}/>
						</HStack>
					) : null}
					{SidebarComponent}
				</div>
			);
			if (testRootSidebar && sidebar && sidebar.sidebarEl) return createPortal(content, sidebar.sidebarEl);
		};

		return (
			<VStack frame>
				{TopComponent}
				<FabLayout FabComponent={FabComponent} pan={pan}>
					<ScrollView frame>
						<VStack spacing>
							{SidebarComponent && renderSidebar()}
							{MainComponent}
						</VStack>
					</ScrollView>
				</FabLayout>
				{BottomComponent}
			</VStack>
		);
	}

	const renderSidebar = () => {
		const content = (
			<div
				className="sidebar-layout-sidebar sheen"
				ref={testRootSidebar && sidebar && sidebar.sidebarEl ? sidebar.setSidebarContentEl : undefined}
				children={SidebarComponent}
			/>
		);
		if (!testRootSidebar) return content;
		if (sidebar && sidebar.sidebarEl) return createPortal(content, sidebar.sidebarEl);
	};

	return (
		<VStack frame spacing>
			{TopComponent}
			<HStack frame className="sidebar-layout">
				{SidebarComponent && renderSidebar()}
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
