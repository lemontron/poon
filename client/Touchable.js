import { createElement, useState } from 'react';
import { navigation } from 'meteor/poon-router';
import { c, useMobile } from './util';

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
	type = 'button',
	replaceState,
	mobileOnly,
	ref,
	elementRef,
}) => {
	const [touched, setTouched] = useState(false);
	const isClickable = !!(href || onClick) && !disabled;
	const isMobile = useMobile();

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
			navigation.go(`${url.pathname}${url.search}${url.hash}`, undefined, undefined, {replaceState});
		}
	};

	const touch = (e) => {
		if (e.button && e.button !== 0) return; // If mouse, only process left clicks
		setTouched(true);
		if (onPointerDown) onPointerDown(e);
	};

	const leave = () => {
		setTouched(false);
	};

	// Determine tag name
	let tagName = 'span';
	if (onClick) tagName = 'button';
	if (href) tagName = 'a';

	if (mobileOnly && !isMobile) return null;
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
		'onContextMenu': disableMenu ? e => {
			e.preventDefault();
			return false;
		} : undefined,
		'style': style,
		'type': type,
		'ref': elementRef || ref,
	}, children);
};
