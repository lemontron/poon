import React, { Fragment } from 'react';
import { Icon } from './Icon';
import { HeaderButton } from './HeaderButton';

const closeImage = {'card': 'os:back', 'modal': 'os:close', 'reveal': 'apps'};

export const ScreenHeader = ({
	title,
	subtitle,
	presentation = 'card',
	onClose,
	headerRight,
	headerLeft,
	SearchComponent,
	onBeforeClose,
}) => {
	const pressBack = async (e) => {
		e.stopPropagation();
		e.preventDefault();

		if (onBeforeClose) { // THE HOOOOOK
			const ok = await onBeforeClose();
			if (ok) onClose();
		} else {
			onClose();
		}
	};

	const renderHeaderLeft = () => {
		if (headerLeft) return headerLeft; // Prefer custom headerLeft

		const closeIcon = closeImage[presentation];
		if (closeIcon) return (
			<HeaderButton
				onClick={pressBack}
				children={<Icon icon={closeIcon}/>}
			/>
		);
	};

	if (presentation === 'fullscreen') return null;

	return (
		<Fragment>
			<div className="header">
				<div className="header-spacer" children={renderHeaderLeft()}/>
				<div className="header-middle">
					<div className="header-title">{title}</div>
					{subtitle ? <div className="header-subtitle">{subtitle}</div> : null}
				</div>
				<div className="header-spacer">{headerRight}</div>
			</div>
			{SearchComponent ? (
				<div className="header-search" children={SearchComponent}/>
			) : null}
		</Fragment>
	);
};