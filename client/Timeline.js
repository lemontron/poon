import React, { Fragment } from 'react';
import { Icon } from './Icon';
import { c } from './util';
import { Touchable } from './Touchable';
import { relativeDate } from './util/format';

export const TimelineItem = ({title, detail, isComplete, onSkip, date, renderDetails, isActive}) => {
	const getIcon = () => {
		if (isComplete) return 'check';
		if (isActive) return 'circle';
	};

	const isDisabled = (!isComplete && !isActive);
	return (
		<div className={c('timeline-item', isDisabled && 'disabled', isActive && 'active')}>
			<div className="timeline-item-left">
				<div className="timeline-item-line top"/>
				<div className="timeline-item-icon">
					<Icon icon={getIcon()}/>
				</div>
				<div className="timeline-item-line"/>
			</div>
			<div className="timeline-item-right">
				<div className="timeline-item-title">
					<label>{title}</label>
					{detail ? <span className="meta">{detail}</span> : null}
					{date ? (
						<span className="meta">{relativeDate(date)}</span>
					) : null}
					{(isActive && onSkip) ? (
						<Touchable children="Skip" onClick={onSkip}/>
					) : null}
				</div>
				{(isActive && !isComplete) ? (
					<div className="timeline-item-details">{renderDetails()}</div>
				) : null}
			</div>
		</div>
	);
};

export const Timeline = ({items, renderItem}) => {
	const firstActionableStep = items.find(item => !item.isComplete);
	return (
		<div
			className="timeline"
			children={items.map(item => (
				<Fragment key={item._id}>
					{renderItem({...item, firstActionableStep})}
				</Fragment>
			))}
		/>
	);
};