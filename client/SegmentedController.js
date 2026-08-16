import React, { Fragment, useEffect, useRef } from 'react';
import { Touchable } from './Touchable';
import { useAnimatedValue } from './util/animated';
import { c } from './util';

const SegmentedItem = ({item, isLast, active, onChange, index, ref}) => (
	<Fragment>
		<Touchable
			children={(
				<Fragment>
					<span>{item.name}</span>
					{item.badge === undefined ? null : <span className="segmented-badge">{item.badge}</span>}
				</Fragment>
			)}
			onClick={() => onChange(item._id)}
			active={active}
			index={index}
			ref={ref}
		/>
		{isLast ? null : <div className="separator"/>}
	</Fragment>
);

export const SegmentedController = ({options, value, onChange, fullWidth}) => {
	const refs = useRef([]);
	const indicator = useRef();
	const index = options.findIndex(item => item._id === value);
	const layoutKey = options.map(item => `${item.name}:${item.badge}`).join('|');
	const left = useAnimatedValue(0);
	const width = useAnimatedValue(0);

	useEffect(() => {
		left.on(val => indicator.current.style.transform = `translateX(${val}px)`);
		width.on(val => indicator.current.style.width = `${val}px`);
	}, []);

	useEffect(() => {
		if (index === -1) return; // value passed is not one of the options
		const el = refs.current[index]; // element to copy attributes from
		if (width.value === 0) {
			left.setValue(el.offsetLeft);
			width.setValue(el.offsetWidth);
		} else {
			left.spring(el.offsetLeft);
			width.spring(el.offsetWidth);
		}
	}, [index, layoutKey]);

	return (
		<div className={c('segmented', fullWidth && 'full-width')}>
			<div className="segmented-indicator" ref={indicator}/>
			{options.map((item, i) => (
				<SegmentedItem
					key={item._id}
					item={item}
					index={i}
					isLast={i === options.length - 1}
					active={index === i}
					onChange={onChange}
					ref={el => refs.current[i] = el}
				/>
			))}
		</div>
	);
};
