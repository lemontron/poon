import React, { useState } from 'react';
import { createBus, useBackHandler, useBus } from 'meteor/poon-router';
import { Random } from 'meteor/random';
import { c } from '../util';
import { Button } from '../Button';
import { TextInput } from '../TextInput';
import { HStack, VStack } from '../Stack';

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

	const renderButton = (option, i) => {
		const pressButton = () => {
			if (option.onPress) option.onPress();
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
			/>
		);
	};

	const renderButtons = () => {
		// Handler for no options & also prompts because they also have no options
		if (!alert.options) return (
			<HStack padding className="alert-buttons">
				<Button
					color="white"
					fullWidth
					title="Done"
					onClick={() => dismissAlert(alert, input)}
				/>
			</HStack>
		);
		const longOptions = alert.options.some(r => r.name.length > 16);
		if (alert.options.length > 0 && alert.options.length <= 2 && !longOptions) return (
			<HStack
				className="alert-buttons"
				padding spacing
				children={alert.options.map(renderButton)}
			/>
		);
		if (alert.options.length > 0) return (
			<VStack
				padding
				spacing
				className="alert-buttons"
				children={alert.options.map(renderButton)}
			/>
		);
		return null;
	};

	return (
		<div className={c('alert-container', isLast && alert.visible && alert.className)}>
			<div
				className={c('alert', isLast && alert.visible && 'visible')}
				onClick={e => e.stopPropagation()}
			>
				<div className="alert-top">
					{alert.title ? <div className="alert-title">{alert.title}</div> : null}
					{alert.message ? <div className="alert-message">{alert.message}</div> : null}
					{alert.type === PROMPT ? (
						<TextInput className="alert-input" value={input} onChangeText={setInput}/>
					) : null}
				</div>
				{renderButtons()}
			</div>
		</div>
	);
};

export const Alert = () => {
	const alerts = useBus(alertsStore);
	const last = alerts.filter(alert => alert.visible).pop();
	useBackHandler(!!last, () => dismissAlert(last));

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

export const showAlert = (alert, options) => new Promise(resolve => {
	alertsStore.update([...alertsStore.state, {
		'key': Random.id(),
		'callback': resolve,
		'visible': true,
		'options': options,
		'type': ALERT,
		...alert,
	}]);
});

export const showPrompt = (alert, options) => new Promise(resolve => {
	alertsStore.update([...alertsStore.state, {
		'key': Random.id(),
		'callback': resolve,
		'visible': true,
		'options': options,
		'type': PROMPT,
		...alert,
	}]);
});
