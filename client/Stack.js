import React from 'react';
import { c, useMobile } from './util';
import { Touchable } from './Touchable';
import { Icon } from './Icon';

const stackProps = (appearance, {
	justify,
	frame,
	align,
	spacing,
	className,
	passthrough,
	padding,
	safePadding,
	distributed,
	mobileOnly,
	highlight,
	collapse,
	theme,
	...props
}) => {
	const isMobile = useMobile();
	if (mobileOnly && !isMobile) return null;
	return {
		'className': c(
			'stack',
			appearance,
			theme && `theme-${theme}`,
			frame && 'frame',
			justify && `justify-${justify}`,
			align && `align-${align}`,
			passthrough && 'passthrough',
			padding && (typeof padding === 'string' ? `padding-${padding}` : 'padding'),
			spacing && 'spacing',
			safePadding && 'safe',
			distributed && 'distributed',
			highlight && 'highlight',
			collapse && 'collapse',
			className,
		),
		...props,
	};
};

export const VStack = (props) => (<div {...stackProps('v', props)}/>);
export const HStack = (props) => (<div {...stackProps('h', props)}/>);
export const ZStack = (props) => (<div {...stackProps('z', props)}/>);

export const Spacer = () => (<div className="spacer"/>);

export const Row = ({
	title,
	detail,
	subtitle,
	inactive,
	className,
	icon,
	LeftComponent,
	RightComponent,
	onPressMore,
	padding,
	multiLine,
	children,
	highlight,
}) => {
	const renderLeftIcon = () => {
		if (typeof icon === 'string') return <Icon icon={icon}/>;
		if (typeof icon === 'object') return icon;
		return null;
	};

	return (
		<div
			className={c('row', padding && 'padding', inactive && 'inactive', multiLine && 'multi-line', highlight && 'highlight', className)}>
			<div className="row-left">
				{renderLeftIcon()}
			</div>
			{LeftComponent}
			<div className="row-body">
				{title ? (
					<div className="row-header">
						<div className="row-title">
							<span>{title}</span>
							{detail ? <span className="meta">{detail}</span> : null}
						</div>
						{subtitle ? <div className="row-subtitle">{subtitle}</div> : null}
					</div>
				) : null}
				{children}
			</div>
			{RightComponent}
			{onPressMore ? (
				<Touchable
					onClick={onPressMore}
					children={<Icon icon="more_vert"/>}
				/>
			) : null}
		</div>
	);
};

// VStack.propTypes = PropTypes.shape({
// 	appearance: PropTypes.oneOf(['v', 'h', 'z', 'c']),
// 	className: PropTypes.string,
// 	spacing: PropTypes.oneOfString(['none', 'small', 'medium', 'large']),
// });
