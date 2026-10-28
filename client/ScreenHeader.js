import React, { Fragment, useContext } from 'react';
import { Icon } from './Icon';
import { HeaderButton } from './HeaderButton';
import { HeaderSecondaryContext } from './HeaderSecondary';
import { Dropdown } from './Dropdown';

const closeImage = {'card': 'os:back', 'window': 'os:close', 'reveal': 'os:back'};

export const ScreenHeader = ({
	title,
	TitleComponent,
	subtitle,
	presentation = 'card',
	onClose,
	headerRight,
	headerLeft,
	SearchComponent,
	onBeforeClose,
	disableBack,
	MenuComponent,
	onToggleSidebar,
}) => {
	const [, setSecondaryEl] = useContext(HeaderSecondaryContext);

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

	const renderCloseButton = () => {
		if (disableBack) return null;
		const closeIcon = closeImage[presentation];
		if (closeIcon) return (
			<HeaderButton
				onClick={pressBack}
				children={<Icon icon={closeIcon}/>}
			/>
		);
	};

	if (presentation === 'fullscreen') return null;

	const renderTitle = () => (
		<div className="header-title">
			{TitleComponent || title}
			{MenuComponent ? <Icon icon="arrow_drop_down_circle"/> : null}
		</div>
	);

	const renderHeaderMiddle = () => {
		if (TitleComponent) return TitleComponent;
		if (MenuComponent) return (
			<Dropdown
				position="top-left"
				button={renderTitle()}
				children={MenuComponent}
			/>
		);
		return renderTitle();
	};

	return (
		<Fragment>
			<div className="header">
				<div className="header-spacer">
					{renderCloseButton()}
					{headerLeft}
				</div>
				<div className="header-middle">
					{renderHeaderMiddle()}
					{subtitle ? <div className="header-subtitle meta">{subtitle}</div> : null}
				</div>
				<div className="header-spacer">
					<div className="header-secondary" ref={setSecondaryEl}/>
					{headerRight}
					{onToggleSidebar ? (
						<HeaderButton
							icon="side_navigation"
							onClick={onToggleSidebar}
							className="hide-desktop"
						/>
					) : null}
				</div>
			</div>
			{SearchComponent ? (
				<div className="header-search" children={SearchComponent}/>
			) : null}
		</Fragment>
	);
};
