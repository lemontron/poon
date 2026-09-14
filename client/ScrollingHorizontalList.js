import React, { Children, Fragment, isValidElement } from 'react';
import { c, defaultKeyExtractor } from './util';
import { ScrollView } from './ScrollView.js';

const getListChildren = (children) => Children.toArray(children).flatMap(child => {
	if (isValidElement(child) && child.type === Fragment) return Children.toArray(child.props.children);
	return child;
}).filter(Boolean);

export const ScrollingHorizontalList = ({
	items = [],
	keyExtractor = defaultKeyExtractor,
	renderItem,
	className,
	children,
	showSeparators = true,
	safePadding = false,
	well = false,
}) => (
	<div className={c('list', 'horizontal-list', className, safePadding && 'safe-padding', well && 'well')}>
		<ScrollView horizontal className={c('list-body', showSeparators && 'show-separators')}>
			{items.map((item, i) => (
				<div className="horizontal-list-item" key={`item:${keyExtractor(item)}`}>
					{renderItem(item, i)}
				</div>
			))}
			{getListChildren(children).map((child, i) => (
				<div className="horizontal-list-item" key={`child:${child.key ?? i}`}>
					{child}
				</div>
			))}
		</ScrollView>
	</div>
);
