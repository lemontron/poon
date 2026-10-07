import React, { useState } from 'react';
import { createBus, useBackHandler, useBus } from 'meteor/poon-router';
import { Random } from 'meteor/random';
import { c } from '../util';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { PhoneInput } from '../PhoneInput';
import { NumberPad } from '../NumberPad';
import { HStack, VStack } from '../Stack';
import { ScrollView } from '../ScrollView';

export const ALERT = 'alert';
export const PROMPT = 'prompt';

const alertsStore = createBus([]);

const dismissAlert = (alert, val) => {
	// Hide alert
	alertsStore.update(alertsStore.state.map(a => {
		if (a === alert) a.visible = false;
		return a;
	}));

	// Remove alert when animation completes
	setTimeout(() => {
		alert.callback(val);
		alertsStore.update(alertsStore.state.filter(a => a !== alert));
	}, 300);
};

const SingleAlert = ({alert, isLast}) => {
	const [input, setInput] = useState(alert.value || '');
	const hasNumberPad = alert.virtualKeyboard === 'number';

	const renderButton = (option, i) => {
		const pressButton = () => {
			if (option.onClick) option.onClick();
			dismissAlert(alert, option._id);
		};
		return (
			<Button
				key={i}
				className={c('alert-button', option.destructive && 'destructive')}
				onClick={pressButton}
				title={option.name}
				disableMenu
				color={option.color}
				borderless={option.borderless}
			/>
		);
	};

	const renderButtons = () => {
		// Handler for no options & also prompts because they also have no options
		if (!alert.options) return (
			<HStack padding className="alert-bottom alert-buttons">
				<Button
					active
					color="primary"
					fullWidth
					title="Done"
					autoTriggerSeconds={alert.autoTriggerSeconds}
					onClick={() => dismissAlert(alert, input)}
				/>
			</HStack>
		);

		// Display two side by side buttons
		const longOptions = alert.options.some(r => r.name.length > 16);
		if (alert.options.length > 0 && alert.options.length <= 2 && !longOptions) return (
			<HStack
				className="alert-bottom alert-buttons"
				padding spacing
				children={alert.options.map(renderButton)}
			/>
		);

		if (alert.options.length > 0) return (
			<ScrollView className="alert-bottom" frame>
				<VStack
					padding
					spacing
					className="alert-buttons"
					children={alert.options.map(renderButton)}
				/>
			</ScrollView>
		);
		return null;
	};

	return (
		<div className={c('alert-container', alert.className)}>
			<div
				className={c('alert', isLast && alert.visible && 'visible', (alert.inputType === 'phone' || hasNumberPad || alert.renderContent) && 'no-max-height')}
				onClick={e => e.stopPropagation()}
			>
				<div className="alert-top">
					{alert.title ? <div className="alert-title">{alert.title}</div> : null}
					{alert.message ? <div className="alert-message">{alert.message}</div> : null}
					{alert.type === PROMPT ? (
						alert.inputType === 'phone' ? (
							<PhoneInput
								value={input}
								onChangeText={setInput}
							/>
						) : (
							<>
								{hasNumberPad && alert.inputType === 'password' ? (
									<div className="alert-pin-value">
										{'•'.repeat(input.length)}
									</div>
								) : (
									<TextInput
										className="alert-input"
										type={alert.inputType}
										value={input}
										onChangeText={setInput}
										autoFocus
										titleCase={alert.titleCase}
										virtualKeyboard={hasNumberPad ? 'none' : alert.virtualKeyboard}
										autoComplete="off"
									/>
								)}
								{hasNumberPad ? <NumberPad value={input} onChangeText={setInput}/> : null}
							</>
						)
					) : null}
				</div>
				{alert.renderContent ? (
					<div className="alert-content">
						{alert.renderContent(value => dismissAlert(alert, value))}
					</div>
				) : null}
				{renderButtons()}
			</div>
		</div>
	);
};

export const Alert = () => {
	const alerts = useBus(alertsStore);
	const last = alerts.filter(alert => alert.visible).pop();
	useBackHandler(() => dismissAlert(last), !!last);

	if (alerts.length === 0) return null;
	return (
		<div
			className={c('layer alert-backdrop', alerts.some(a => a.visible) && 'visible')}
			onClick={() => dismissAlert(last)}
			children={alerts.map(alert => (
				<SingleAlert key={alert.key} alert={alert} isLast={last === alert}/>
			))}
		/>
	);
};

export const showAlert = (title, opts = {}) => new Promise(resolve => {
	alertsStore.update([...alertsStore.state, {
		'key': Random.id(),
		'callback': resolve,
		'visible': true,
		'title': title,
		'type': ALERT,
		...opts,
	}]);
});

export const showPrompt = (title, opts = {}) => new Promise(resolve => {
	alertsStore.update([...alertsStore.state, {
		'key': Random.id(),
		'callback': resolve,
		'visible': true,
		'title': title,
		'type': PROMPT,
		...opts,
	}]);
});

export const showConfirm = (title) => showAlert(title, {
	'options': [
		{_id: false, name: 'Cancel', borderless: true},
		{_id: true, name: 'Continue'},
	],
});
