import React, { useEffect, useRef, useState } from 'react';
import { ScreenHeader } from './ScreenHeader';
import { ErrorBoundary } from './ErrorBoundary';
import { Pan } from './Pan';
import { useAnimatedValue } from './util/animated';
import { Shade } from './Shade';
import { Layer } from './Layer';
import { useMobile } from './util';
import { VStack } from './Stack';

export const CardLayout = ({children, HeaderComponent, SidebarComponent, ...headerProps}) => {
	const shadeEl = useRef();
	const sidebarEl = useRef();
	const [showSidebar, setShowSidebar] = useState(false);
	const mobile = useMobile();
	const hasSidebar = Boolean(SidebarComponent);
	const pan = useAnimatedValue(0);

	const renderSidebarBody = () => (
		<Pan
			className="card-sidebar"
			ref={sidebarEl}
			direction="x"
			onCapture={e => {
				return (e.direction === 'x' && e.distance < 0);
			}}
			onMove={e => {
				pan.setValue(Math.min(1, (e.size + e.distance) / e.size));
			}}
			onUp={e => {
				if (e.flick === 1) return setShowSidebar(false);
				pan.spring(1);
			}}
			children={
				<VStack className="sidebar-layout-sidebar frame" children={SidebarComponent}/>
			}
		/>
	);

	useEffect(() => {
		if (!mobile || !hasSidebar) return;
		const stop = pan.on(value => {
			sidebarEl.current.style.transform = `translateX(${(value - 1) * 100}%)`;
			shadeEl.current.progress(value);
		});
		pan.forceRender();
		return stop;
	}, [mobile, hasSidebar, pan]);

	useEffect(() => {
		if (!mobile || !hasSidebar) return;
		pan.spring(showSidebar ? 1 : 0);
	}, [showSidebar, mobile, hasSidebar, pan]);

	return (
		<>
			<div className="card-layout">
				{SidebarComponent && !mobile ? (
					<div className="card-sidebar">
						<VStack className="sidebar-layout-sidebar" children={SidebarComponent}/>
					</div>
				) : null}
				<div className="card-main">
					{HeaderComponent || <ScreenHeader
						{...headerProps}
						onToggleSidebar={SidebarComponent && mobile ? () => setShowSidebar(visible => !visible) : undefined}
					/>}
					<div className="card-body">
						<ErrorBoundary children={children}/>
					</div>
				</div>
			</div>
			{SidebarComponent && mobile ? <Layer isActive={showSidebar}>
				<Shade ref={shadeEl}/>
				{renderSidebarBody()}
			</Layer> : null}
		</>
	);
};
