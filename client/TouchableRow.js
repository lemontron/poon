import React, { useContext, useEffect, useRef } from 'react';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { c } from './util';
import { Row } from './Stack';
import { ListReorderContext } from './useReorder.js';
import { Pan } from './Pan';
import { useAnimatedValue } from './util/animated';

export const TouchableRow = ({
	LeftButton,
	onPressMore,
	href,
	onClick,
	target,
	disabled,
	inactive,
	caret,
	active,
	highlight,
	replaceState,
	OuterRightComponent,
	SwipeComponent,
	...props
}) => {
	const reorder = useContext(ListReorderContext);
	const bodyEl = useRef();
	const actionsEl = useRef();
	const actionsInnerEl = useRef();
	const refs = useRef({}).current;
	const pan = useAnimatedValue(0);

	useEffect(() => {
		return pan.on(val => {
			bodyEl.current.style.transform = `translateX(${-val}px)`;
			if (actionsEl.current) actionsEl.current.style.width = `${val}px`;
		});
	}, []);

	useEffect(() => {
		if (!SwipeComponent) pan.setValue(0);
	}, [SwipeComponent]);

	const closeSwipe = e => {
		if (refs.ignoreClick) {
			refs.ignoreClick = false;
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		if (!pan.value) return;
		e.preventDefault();
		e.stopPropagation();
		pan.spring(0);
	};

	return (
		<div
			className={c('touchable-highlight touchable-row', SwipeComponent && 'swipeable', disabled && 'disabled', inactive && 'inactive', active && 'active', highlight && 'highlight', caret && 'caret', reorder?.dragging && 'dragging', reorder?.position && `drop-${reorder.position}`)}
			data-index={reorder?.index}
		>
			{SwipeComponent ? (
				<div className="touchable-row-swipe-actions" ref={actionsEl}>
					<div className="touchable-row-swipe-actions-inner" ref={actionsInnerEl}>
						{SwipeComponent}
					</div>
				</div>
			) : null}
			<Pan
				direction="x"
				className="touchable-row-body"
				ref={bodyEl}
				onClickCapture={SwipeComponent ? closeSwipe : undefined}
				onDown={() => {
					if (!SwipeComponent) return;
					pan.end();
					refs.width = actionsInnerEl.current.offsetWidth;
					refs.initial = pan.value;
				}}
				onCapture={e => {
					if (!SwipeComponent || !refs.width) return;
					if (e.direction !== 'x') return;
					if (e.distance < 0) return true;
					return pan.value > 0;
				}}
				onMove={e => {
					refs.ignoreClick = true;
					pan.setValue(Math.max(0, Math.min(refs.width, refs.initial - e.distance)));
				}}
				onUp={e => {
					setTimeout(() => refs.ignoreClick = false, 400);
					if (e.flick === 1) return pan.spring(refs.width, e.flickMs);
					if (e.flick === -1) return pan.spring(0, e.flickMs);
					pan.spring(pan.value > (refs.width / 2) ? refs.width : 0);
				}}
			>
				{reorder?.onReorder ? (
					<span
						className="touchable-row-drag-handle material-symbols"
						children="drag_indicator"
						{...reorder.onReorder}
					/>
				) : null}
				{LeftButton}
				<Touchable
					className="touchable-row-button"
					onClick={onClick}
					href={href}
					target={target}
					replaceState={replaceState}
				>
					<Row {...props}/>
					{caret ? <Icon icon="chevron_right"/> : null}
				</Touchable>
				{onPressMore ? (
					<Touchable
						onClick={onPressMore}
						children={<Icon icon="more_vert"/>}
					/>
				) : null}
				{OuterRightComponent}
			</Pan>
		</div>
	);
};
