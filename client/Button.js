import React, { useEffect, useRef } from 'react';
import { c } from './util';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { ActivityIndicator } from './ActivityIndicator';

/**
 * @typedef {object} ButtonProps
 * @property {string} [className]
 * @property {import('react').ReactNode} [title]
 * @property {(event: any) => void} [onClick]
 * @property {() => void} [onLongPress]
 * @property {(event: any) => void} [onDown]
 * @property {string} [icon]
 * @property {string} [href]
 * @property {number} [tabIndex]
 * @property {'primary' | 'success' | 'warning' | 'error' | 'glass'} [color]
 * @property {boolean} [disabled]
 * @property {boolean} [download]
 * @property {string} [iconImageUrl]
 * @property {boolean} [loading]
 * @property {boolean} [submit]
 * @property {boolean} [fullWidth]
 * @property {boolean} [active]
 * @property {string} [target]
 * @property {number} [autoTriggerSeconds]
 */

/** @param {ButtonProps} props */
export const Button = ({
	className,
	title,
	onClick,
	onLongPress,
	onDown,
	icon,
	href,
	tabIndex,
	color,
	disabled,
	download,
	iconImageUrl,
	loading,
	submit,
	fullWidth,
	replaceState,
	presentation,
	target,
	active,
	muted,
	square,
	borderless,
	styles,
	round,
	autoTriggerSeconds,
}) => {
	const buttonEl = useRef(null);
	const longPress = useRef({timer: null, handled: false});

	useEffect(() => () => clearTimeout(longPress.current.timer), []);

	useEffect(() => {
		if (!autoTriggerSeconds || disabled || loading) return;
		const handle = setTimeout(() => {
			buttonEl.current.click();
		}, (autoTriggerSeconds * 1000));
		return () => clearTimeout(handle);
	}, [autoTriggerSeconds, disabled, loading]);

	return (
		<Touchable
			styles={styles}
			type={submit ? 'submit' : 'button'}
			className={c('btn', active ? 'solid' : 'outline', className, disabled && 'disabled', loading && 'loading', borderless && 'borderless', presentation && `btn-${presentation}`, fullWidth && 'full-width', color && `btn-${color}`, muted && 'muted', square && 'square', round && 'round')}
			onClick={e => {
				if (longPress.current.handled) {
					e.preventDefault();
					return;
				}
				if (download) e.stopPropagation();
				if (onClick) onClick(e);
			}}
			onTouchedChange={onLongPress ? touched => {
				clearTimeout(longPress.current.timer);
				if (!touched) return;
				longPress.current.handled = false;
				longPress.current.timer = setTimeout(() => {
					longPress.current.handled = true;
					onLongPress();
				}, 700);
			} : undefined}
			disableMenu={!!onLongPress}
			href={href}
			onTouchStart={onDown}
			tabIndex={tabIndex}
			target={target}
			replaceState={replaceState}
			elementRef={buttonEl}
		>
			{autoTriggerSeconds && !disabled && !loading ? (
				<div
					className="btn-layer btn-progress"
					style={{animationDuration: `${autoTriggerSeconds}s`}}
				/>
			) : null}
			{loading ? <div className="btn-layer"><ActivityIndicator color="var(--bg-primary)"/></div> : null}
			<div className="btn-inner">
				{iconImageUrl ? <img src={iconImageUrl} alt={title}/> : null}
				{icon ? <Icon icon={icon}/> : null}
				{title ? <span>{title}</span> : null}
			</div>
		</Touchable>
	);
};
