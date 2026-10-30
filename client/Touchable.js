import { createElement, useState } from 'react';
import { navigation } from 'meteor/poon-router';
import { c } from './util';

export const Touchable = ({
	href,
	onClick,
	className,
	active,
	target,
	children,
	style,
	disabled,
	disableMenu,
	onPointerDown,
	onTouchedChange,
	type = 'button',
	replaceState,
	ref,
	elementRef,
}) => {
	const [touched, setTouched] = useState(false);
	const isClickable = !!(href || onClick) && !disabled;

	const clickButton = (e) => {
		if (onClick) {
			if (!href) e.preventDefault();
			onClick(e);
		}

		const isNative = (target === '_blank' || target === '_self' || e.metaKey || e.ctrlKey || e.defaultPrevented || !href);
		if (isNative) return;

		const url = new URL(href, location.href);
		if (url.hostname === location.hostname) {
			e.preventDefault();
			navigation.go(`${url.pathname}${url.search}${url.hash}`, {replaceState});
		}
	};

	const touch = (e) => {
		if (e.button && e.button !== 0) return; // If mouse, only process left clicks
		setTouched(true);
		if (onTouchedChange) onTouchedChange(true);
		if (onPointerDown) onPointerDown(e);
	};

	const leave = () => {
		setTouched(false);
		if (onTouchedChange) onTouchedChange(false);
	};

	// Determine tag name
	let tagName = 'span';
	if (onClick) tagName = 'button';
	if (href) tagName = 'a';

	return createElement(tagName, {
		'className': c('touchable', className, touched && 'touched', disableMenu && 'disable-menu', active && 'active', disabled && 'disabled'),
		'href': disabled ? undefined : href,
		'disabled': tagName === 'button' ? !!disabled : undefined,
		'onPointerDown': isClickable ? touch : undefined,
		'onPointerUp': isClickable ? leave : undefined,
		'onPointerLeave': isClickable ? leave : undefined,
		'onPointerCancel': isClickable ? leave : undefined,
		'onClick': isClickable ? clickButton : undefined,
		'target': target,
		'draggable': false,
		'onContextMenu': e => {
			if (disableMenu) e.preventDefault();
			// const el = document.getElementById('context-menu');
			// el.style.top = e.pageY + 'px';
			// el.style.left = e.pageX + 'px';
			return false;
		},
		'style': style,
		'type': type,
		'ref': elementRef || ref,
	}, children);
};
