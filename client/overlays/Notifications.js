import React, { useRef, useEffect } from 'react';
import { createBus, useBus } from 'meteor/poon-router';
import { Random } from 'meteor/random';
import { useAnimatedValue } from '../util/animated';
import { toPercent } from '../util';
import { Touchable } from '../Touchable';
import { Icon } from '../Icon';
import { Pan } from '../Pan';
import { Layer } from '../Layer';

const state = createBus([]);

const Notification = ({
	notification,
}) => {
	const {title, body, icon, onDismiss = () => null} = notification;
	const el = useRef();
	const pan = useAnimatedValue(0);

	const dismiss = async () => {
		await onDismiss();
		state.update(state.state.filter(n => n !== notification));
	};

	useEffect(() => {
		return pan.on(val => {
			el.current.style.opacity = (1 - Math.abs(val));
			el.current.style.transform = `translateX(${toPercent(val)})`;
		});
	}, []);

	return (
		<Pan
			direction="x"
			ref={el}
			className="notification"
			onCapture={(e) => {
				return (e.direction === 'x');
			}}
			onMove={(e) => {
				pan.setValue(e.distance / e.size);
			}}
			onUp={(e) => {
				if (e.flick) {
					pan.spring(-e.flick).then(dismiss);
				} else {
					pan.spring(0).then(dismiss);
				}
			}}
		>
			{icon ? <Icon icon={icon} className="notification-icon"/> : null}
			<div className="notification-middle">
				<div className="notification-title">{title}</div>
				<div className="notification-body">{body}</div>
			</div>
			<Touchable
				onClick={dismiss}
				className="notification-close"
				children={<Icon icon="close"/>}
			/>
		</Pan>
	);
};

export const Notifications = () => {
	return null;
	const notifications = useBus(state);
	if (notifications.length === 0) return null;
	return (
		<Layer
			isActive={true}
			className="poon-notifications"
			children={notifications.map(data => (
				<Notification key={data.key} notification={data}/>
			))}
		/>
	);
};

export const showNotification = (data) => {
	state.update([...state.state, {key: Random.id(), ...data}]);
};
