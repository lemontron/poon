import React, { useContext } from 'react';
import { createPortal } from 'react-dom';
import { CardSidebarContext } from '../CardSidebarContext';
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
	testRootSidebar,
	sidebarTheme,
}) => {
	const mobile = useMobile();
	const sidebar = useContext(CardSidebarContext);

	if (mobile) {
		const renderSidebar = () => {
			if (showSidebar === 'always') return (
				<VStack
					theme={sidebarTheme}
					className="sidebar-layout-sidebar"
					children={SidebarComponent}
				/>
			);
			if (testRootSidebar && sidebar && sidebar.sidebarEl) return createPortal((
				<VStack
					className="sidebar-layout-sidebar"
					ref={testRootSidebar && sidebar && sidebar.sidebarEl ? sidebar.setSidebarContentEl : undefined}
					children={SidebarComponent}
				/>
			), sidebar.sidebarEl);
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
			<VStack
				theme={sidebarTheme}
				className="sidebar-layout-sidebar"
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
