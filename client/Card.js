import React, { Fragment, useEffect, useRef, useState } from 'react';
import { navigation } from 'meteor/poon-router';
import { useAnimatedValue } from './util/animated';
import { useSize } from './util/size';
import { c } from './util';
import { ScreenHeader } from './ScreenHeader';
import { Placeholder } from './Placeholder';
import { Shade } from './Shade';
import { Pan } from './Pan';
import { Layer } from './Layer';
import { HeaderButton } from './HeaderButton';
import { ErrorBoundary } from './ErrorBoundary';

export const Card = ({
	presentation = 'card',
	title,
	subtitle,
	children,
	footer,
	headerLeft,
	headerRight,
	SearchComponent,
	SidebarComponent,
	showSidebar,
	disableGestures,
	onDrop,
	isVisible,
	animateIn = true,
	ShadeComponent = Shade,
	BackgroundComponent,
	HeaderComponent,
	className,
	theme,
	onBeforeClose,
	ref: el,
}) => {
	el = el || useRef();
	const [dropping, setDropping] = useState(false);
	const [sidebarVisible, setSidebarVisible] = useState(false);
	const shadeEl = useRef();
	const {width} = useSize(el);
	const pan = useAnimatedValue(animateIn ? document.body.clientWidth : 0);

	const close = () => navigation.goBack();

	useEffect(() => {
		if (typeof title === 'string') {
			document.title = title;
			return () => delete document.title;
		}
	}, [title]);

	// Trigger animation on visibility change
	useEffect(() => {
		if (!width) return;
		if (isVisible && !animateIn) return;

		pan.spring(isVisible ? 0 : width);
	}, [animateIn, isVisible, width]);

	useEffect(() => {
		return pan.on(value => {
			if (el.current) el.current.style.transform = `translateX(${value}px)`;
			if (shadeEl.current) shadeEl.current.progress(value, width);
		});
	}, [width]);

	const dragOver = (e) => {
		e.preventDefault();
	};

	const startDrag = () => {
		setDropping(true);
	};

	const cancelDrag = () => {
		setDropping(false);
	};

	const dismissSidebar = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setSidebarVisible(false);
	};

	const drop = (e) => {
		e.preventDefault();
		setDropping(false);
		onDrop(e);
	};

	const renderHeader = () => {
		if (HeaderComponent) return HeaderComponent;
		return (
			<ScreenHeader
				title={title}
				subtitle={subtitle}
				presentation={presentation}
				SearchComponent={SearchComponent}
				onClose={close}
				onBeforeClose={onBeforeClose}
				headerRight={
					<Fragment>
						{headerRight}
						{SidebarComponent && showSidebar === 'always' ? (
							<HeaderButton
								className="card-sidebar-toggle"
								icon={sidebarVisible ? 'close' : 'sort'}
								onClick={() => setSidebarVisible(!sidebarVisible)}
							/>
						) : null}
					</Fragment>
				}
				headerLeft={headerLeft}
			/>
		);
	};

	return (
		<Layer isActive={isVisible} className={className} theme={theme}>
			{ShadeComponent ? <ShadeComponent ref={shadeEl}/> : null}
			<Pan
				direction="x"
				className={c('card', animateIn && 'animate')}
				ref={el}
				onDragOver={onDrop && dragOver}
				onDragEnter={onDrop && startDrag}
				onDragLeave={onDrop && cancelDrag}
				onDrop={onDrop && drop}
				onCapture={e => {
					if (disableGestures) return;
					return (e.direction === 'x' && e.distance > 0);
				}}
				onMove={e => {
					pan.setValue(Math.max(0, e.distance));
				}}
				onUp={e => {
					if (e.flick === -1) return close();
					pan.spring(0); // Return to start
				}}
			>
				{BackgroundComponent}
				{renderHeader()}
				<div className="card-content">
					{SidebarComponent ? (
						<div
							className={c('card-sidebar card-main-sidebar', sidebarVisible && 'visible')}
							children={SidebarComponent}
						/>
					) : null}
					<div
						className="card-body"
						onPointerDownCapture={sidebarVisible ? e => e.stopPropagation() : undefined}
						onClickCapture={sidebarVisible ? dismissSidebar : undefined}
					>
						<ErrorBoundary>
							{children}
						</ErrorBoundary>
					</div>
				</div>
				{footer}
				{dropping ? (
					<Placeholder className="drop-zone" icon="upload" title="Upload"/>
				) : null}
			</Pan>
		</Layer>
	);
};
