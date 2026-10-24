import React, { useEffect, useRef, useState } from 'react';
import { navigation } from 'meteor/poon-router';
import { useAnimatedValue } from './util/animated';
import { useSize } from './util/size';
import { c } from './util';
import { ScreenHeader } from './ScreenHeader';
import { Placeholder } from './Placeholder';
import { Shade } from './Shade';
import { Pan } from './Pan';
import { Layer } from './Layer';
import { ErrorBoundary } from './ErrorBoundary';
import { CardSidebarContext } from './CardSidebarContext';

export const Card = ({
	presentation = 'card',
	title,
	TitleComponent,
	TitleImage,
	subtitle,
	children,
	footer,
	headerLeft,
	headerRight,
	SearchComponent,
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
	disableBack,
	MenuComponent,
	ref: el,
}) => {
	el = el || useRef();
	const [dropping, setDropping] = useState(false);
	const [sidebarEl, setSidebarEl] = useState(null);
	const [showSidebar, setShowSidebar] = useState(false);
	const [sidebarContentEl, setSidebarContentEl] = useState(null);
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
				TitleImage={TitleImage}
				TitleComponent={TitleComponent}
				subtitle={subtitle}
				presentation={presentation}
				SearchComponent={SearchComponent}
				onClose={close}
				onBeforeClose={onBeforeClose}
				headerRight={headerRight}
				headerLeft={headerLeft}
				disableBack={disableBack}
				MenuComponent={MenuComponent}
			/>
		);
	};

	return (
		<Layer isActive={isVisible} theme={theme}>
			{ShadeComponent ? <ShadeComponent ref={shadeEl}/> : null}
			<Pan
				direction="x"
				className={c('card', className, animateIn && 'animate')}
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
				<CardSidebarContext.Provider value={{sidebarEl, sidebarContentEl, setSidebarContentEl, showSidebar, setShowSidebar}}>
					<div className="card-layout">
						<div className={c('card-sidebar', showSidebar && 'visible')} ref={setSidebarEl}/>
						<div className="card-main">
							{renderHeader()}
							<div className="card-body">
								<ErrorBoundary children={children}/>
							</div>
							{footer}
						</div>
					</div>
				</CardSidebarContext.Provider>
				{dropping ? (
					<Placeholder className="drop-zone" icon="upload" title="Upload"/>
				) : null}
			</Pan>
		</Layer>
	);
};
