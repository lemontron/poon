import React, { Fragment, useContext } from 'react';
import { Icon } from './Icon';
import { HeaderButton } from './HeaderButton';
import { HeaderSecondaryContext } from './HeaderSecondary';
import { Dropdown } from './Dropdown';

const closeImage = {'card': 'os:back', 'window': 'os:close', 'reveal': 'os:back'};

export const ScreenHeader = ({
	title,
	TitleComponent,
	TitleImage,
	subtitle,
	presentation = 'card',
	onClose,
	headerRight,
	headerLeft,
	SearchComponent,
	onBeforeClose,
	disableBack,
	MenuComponent,
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
			{TitleImage ? <div className="header-image">{TitleImage}</div> : null}
			{TitleComponent || title}
			{MenuComponent ? <Icon icon="arrow_drop_down" size={20}/> : null}
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
					{headerLeft}
					{presentation !== 'window' && renderCloseButton()}
				</div>
				<div className="header-middle">
					{renderHeaderMiddle()}
					{subtitle ? <div className="header-subtitle meta">{subtitle}</div> : null}
				</div>
				<div className="header-spacer">
					<div className="header-secondary" ref={setSecondaryEl}/>
					{headerRight}
					{presentation === 'window' && renderCloseButton()}
				</div>
			</div>
			{SearchComponent ? (
				<div className="header-search" children={SearchComponent}/>
			) : null}
		</Fragment>
	);
};
