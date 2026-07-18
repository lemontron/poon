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
 * @property {(event: any) => void} [onDown]
 * @property {string} [icon]
 * @property {string} [href]
 * @property {number} [tabIndex]
 * @property {string} [color]
 * @property {boolean} [disabled]
 * @property {boolean} [download]
 * @property {string} [iconImageUrl]
 * @property {boolean} [loading]
 * @property {boolean} [submit]
 * @property {boolean} [fullWidth]
 * @property {boolean} [active]
 * @property {string} [target]
 * @property {number} [autoTrigger]
 */

/** @param {ButtonProps} props */
export const Button = ({
	className,
	title,
	onClick,
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
	autoTrigger,
}) => {
	const buttonEl = useRef(null);

	useEffect(() => {
		if (!autoTrigger || disabled || loading) return;
		const handle = setTimeout(() => {
			buttonEl.current.click();
		}, (autoTrigger * 1000));
		return () => clearTimeout(handle);
	}, [autoTrigger, disabled, loading]);

	return (
		<Touchable
			styles={styles}
			type={submit ? 'submit' : 'button'}
			className={c('btn', active ? 'solid' : 'outline', className, disabled && 'disabled', loading && 'loading', borderless && 'borderless', presentation && `btn-${presentation}`, fullWidth && 'full-width', color && `btn-${color}`, muted && 'muted', square && 'square', round && 'round')}
			onClick={e => {
				if (download) e.stopPropagation();
				if (onClick) onClick(e);
			}}
			href={href}
			onTouchStart={onDown}
			tabIndex={tabIndex}
			target={target}
			replaceState={replaceState}
			elementRef={buttonEl}
		>
			{autoTrigger && !disabled && !loading ? (
				<div
					className="btn-layer btn-progress"
					style={{animationDuration: `${autoTrigger}s`}}
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
