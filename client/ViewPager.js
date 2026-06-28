import React, { Children, isValidElement, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useAnimatedValue } from './util/animated';
import { c, createClamp, lerp, toPercent } from './util';
import { Pan } from './Pan';
import { Touchable } from './Touchable';
import { List } from './List';
import { TouchableRow } from './TouchableRow';

const PagerDot = ({pan, i}) => {
	const el = useRef();

	useEffect(() => {
		return pan.on(value => {
			const dist = Math.abs(i - value);
			el.current.style.opacity = Math.max(.5, 1 - dist);
		});
	}, []);

	return (
		<div
			className="pager-dot"
			ref={el}
			style={{opacity: pan.value === i ? 1 : .5}}
		/>
	);
};

const PagerTabTitle = ({page, i, titleExtractor, pan, onClick}) => {
	const indicatorEl = useRef();
	const titleEl = useRef();

	const getOpacity = (value) => Math.max(0.5, 1 - Math.abs(i - value));
	const getLeft = (value) => toPercent(value - i);

	useEffect(() => {
		return pan.on(value => {
			titleEl.current.style.opacity = getOpacity(value);
			indicatorEl.current.style.left = getLeft(value);
		});
	}, []);

	return (
		<div className="pager-tab" onClick={() => onClick(i)}>
			<div
				className="pager-tab-title"
				ref={titleEl}
				style={{opacity: getOpacity(pan.value)}}
			>
				<label>{titleExtractor(page) || `Page ${i + 1}`}</label>
				{page.badge ? <div className="pager-tab-badge">{page.badge}</div> : null}
			</div>
			<div className="pager-tab-indicator-track">
				<div
					className="pager-tab-indicator"
					ref={indicatorEl}
					style={{left: getLeft(pan.value)}}
				/>
			</div>
		</div>
	);
};

const ViewPagerPage = ({children}) => children;

export const ViewPager = ({
	pages = [],
	children,
	renderPage,
	vertical,
	className,
	page = 0,
	gap = 0,
	onChangePage,
	enableScrolling = true,
	showDots = false,
	showButtons = false,
	showSidebar,
	sidebarTitle,
	frame,
	lazy = false,
	titleExtractor = r => r.title || r.name,
	keyExtractor = r => r._id || r.title || r.name,
	ref,
}) => {
	// use internal state or external state!
	const childPages = Children.toArray(children).map(child => {
		if (!isValidElement(child)) return {'content': child};

		if (child.type === ViewPagerPage) return {
			...child.props,
			'_id': child.key,
			'content': child.props.children,
		};

		return {
			'_id': child.key,
			'title': child.props.title,
			'badge': child.props.badge,
			'isHidden': child.props.isHidden,
			'content': child,
		};
	});
	const filteredPages = [...pages, ...childPages].filter(r => !r.isHidden);
	const [internalPage, setInternalPage] = useState(page);

	const pan = useAnimatedValue(page); // The page index
	const overscroll = useAnimatedValue(0);
	const scrollerEl = useRef();
	const tabsEl = useRef();
	const sidebarEl = useRef();
	const sidebarAccentEl = useRef();
	const refs = useRef({}).current;

	const lastIndex = filteredPages.length - 1;
	const orientation = vertical ? 'y' : 'x';
	const clamp = createClamp(0, lastIndex);

	const hasTitles = filteredPages.some(titleExtractor);
	const showTitles = (hasTitles && filteredPages.length > 1);
	const hasSidebar = (showSidebar && hasTitles);
	const lazyWindow = lazy === true ? 1 : typeof lazy === 'number' ? lazy : Infinity;

	const shouldRenderPage = i => Math.abs(i - internalPage) <= lazyWindow;

	const renderPageContent = (item, i) => {
		if (!shouldRenderPage(i)) return null;
		if (Object.prototype.hasOwnProperty.call(item, 'content')) return item.content;
		return renderPage(item, i);
	};

	const renderSidebarAccent = (value) => {
		if (!sidebarEl.current || !sidebarAccentEl.current) return;
		const rows = sidebarEl.current.querySelectorAll('.touchable-row');
		if (!rows.length) return;

		const firstIndex = Math.floor(value);
		const secondIndex = Math.min(lastIndex, firstIndex + 1);
		const amount = value - firstIndex;
		const first = rows[firstIndex];
		const second = rows[secondIndex];

		sidebarAccentEl.current.style.transform = `translateY(${lerp(amount, first.offsetTop, second.offsetTop)}px)`;
		sidebarAccentEl.current.style.height = `${lerp(amount, first.offsetHeight, second.offsetHeight)}px`;
	};

	const userInteractionChangePage = (page, flickMs) => {
		page = clamp(page);
		if (onChangePage) onChangePage(page);
		setInternalPage(page);
		pan.spring(page, flickMs);
		return page;
	};

	useImperativeHandle(ref, () => ({
		scrollToPage: userInteractionChangePage,
	}), [onChangePage]);

	// Springs when the page changes
	useEffect(() => {
		setInternalPage(page);
		pan.spring(page);
	}, [page]);

	useLayoutEffect(() => { // Renderer
		const render = (value) => {
			const scroller = scrollerEl.current;
			if (!scroller) return;

			if (vertical) {
				scroller.scrollTop = (value * scroller.clientHeight) + (gap * value);
			} else {
				scroller.scrollLeft = (value * scroller.clientWidth) + (gap * value);
				if (tabsEl.current) { // scroll the tabs as we scroll the pager
					const overflowWidth = (tabsEl.current.scrollWidth - tabsEl.current.clientWidth);
					tabsEl.current.scrollLeft = lerp(value / lastIndex, 0, overflowWidth);
				}
				renderSidebarAccent(value);
			}
		};

		const off = pan.on(render);
		const ro = new ResizeObserver(() => render(pan.value));

		render(pan.value);
		ro.observe(scrollerEl.current);
		return () => {
			off();
			ro.disconnect();
		};
	}, [vertical, gap, lastIndex]);

	useEffect(() => {
		requestAnimationFrame(() => renderSidebarAccent(pan.value));
	}, [filteredPages.length, sidebarTitle]);

	useEffect(() => {
		return overscroll.on(val => {
			scrollerEl.current.style.transform = `${vertical ? 'translateY' : 'translateX'}(${val / 4}px)`;
		});
	}, [vertical]);

	const renderScroller = () => (
		<Pan
			direction={vertical ? 'y' : 'x'}
			className="pager-scroller"
			ref={scrollerEl}
			enabled={enableScrolling}
			onCapture={(e) => {
				if (e.overscrolling) return false;
				if (e.direction === orientation) {
					if (e.distance < 0) return true; // Don't capture at the left edge
					return (refs.initPan - (e.distance / e.size)) > 0;
				}
			}}
			onDown={() => {
				pan.end();
				refs.currentPage = Math.round(pan.value);
				refs.initPan = pan.value;
			}}
			onMove={e => {
				const val = clamp(refs.initPan - (e.distance / e.size));
				pan.setValue(val);
			}}
			onPan={components => { // ScrollWheel
				const e = components[orientation];
				const pos = pan.value + (e.distance / e.size);
				pan.setValue(clamp(pos));
			}}
			onUp={(e) => {
				if (e.flick) {
					userInteractionChangePage(refs.currentPage + e.flick, e.flickMs);
				} else { // Snap back to current page
					userInteractionChangePage(Math.round(pan.value));
				}
			}}
			onOverscroll={val => {
				if (val === null) {
					overscroll.spring(0);
				} else {
					overscroll.setValue(val);
				}
			}}
			children={filteredPages.map((item, i) => (
				<div
					key={keyExtractor(item) || i}
					className="pager-page"
					children={renderPageContent(item, i)}
					style={gap ? (vertical ? {marginBottom: gap} : {marginRight: gap}) : undefined}
				/>
			))}
		/>
	);

	return (
		<div
			className={c('pager', vertical ? 'vertical' : 'horizontal', hasSidebar && 'with-sidebar', showSidebar === 'always' && 'show-sidebar-always', frame && 'frame', className)}>
			{showTitles ? (
				<div className="pager-tabs" ref={tabsEl}>
					{filteredPages.map((page, i) => (
						<PagerTabTitle
							key={i}
							page={page}
							pan={pan}
							i={i}
							onClick={userInteractionChangePage}
							titleExtractor={titleExtractor}
						/>
					))}
				</div>
			) : null}
			{hasSidebar ? (
				<div className="pager-content">
					<div className="card-sidebar" ref={sidebarEl}>
						<div className="pager-sidebar-accent" ref={sidebarAccentEl}/>
						<List
							title={sidebarTitle}
							items={filteredPages}
							renderItem={(page, i) => (
								<TouchableRow
									key={i}
									title={titleExtractor(page) || `Page ${i + 1}`}
									onClick={() => userInteractionChangePage(i)}
									RightComponent={page.badge ?
										<div className="pager-tab-badge">{page.badge}</div> : null}
								/>
							)}
						/>
					</div>
					{renderScroller()}
				</div>
			) : renderScroller()}
			{showDots ? (
				<div
					className="pager-dots"
					children={filteredPages.map((item, i) => <PagerDot key={i} pan={pan} i={i}/>)}
				/>
			) : null}
			{showButtons ? (
				<div className="pager-buttons">
					<Touchable
						className="material-symbols pager-button"
						onClick={() => userInteractionChangePage(pan.value - 1)}
						children="arrow_circle_left"
						disabled={internalPage === 0}
					/>
					<Touchable
						className="material-symbols pager-button"
						onClick={() => userInteractionChangePage(pan.value + 1)}
						children="arrow_circle_right"
						disabled={internalPage === lastIndex}
					/>
				</div>
			) : null}
		</div>
	);
};

ViewPager.Page = ViewPagerPage;
