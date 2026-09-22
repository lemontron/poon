import React from 'react';
import { useMobile } from '../util';
import { ScrollView } from '../ScrollView';
import { VStack } from '../Stack';

export const SidebarLayout = ({
	SidebarComponent,
	children,
	sidebarVisible = true,
	onDismissSidebar,
}) => {
	const mobile = useMobile();

	if (mobile) return (
		<ScrollView frame padding>
			<VStack spacing>
				<div className="sidebar-layout-sidebar-content" children={SidebarComponent}/>
				{children}
			</VStack>
		</ScrollView>
	);

	return (
		<div className="sidebar-layout">
			{SidebarComponent ? (
				<div className="sidebar-layout-sidebar">
					<div className="sidebar-layout-sidebar-content">
						{SidebarComponent}
					</div>
				</div>
			) : null}
			<ScrollView
				className="sidebar-layout-main"
				onPointerDownCapture={sidebarVisible ? e => e.stopPropagation() : undefined}
				onClickCapture={sidebarVisible ? onDismissSidebar : undefined}
				children={children}
				frame
			/>
		</div>
	);
};