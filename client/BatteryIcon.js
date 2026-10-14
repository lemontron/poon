import React from 'react';
import { Icon } from './Icon';

const getBatteryIcon = (batteryLevel, isCharging) => {
	if (isCharging) {
		const level = [20, 30, 50, 60, 80, 100].find(level => batteryLevel <= level / 100);
		return `battery_charging_${level === 100 ? 'full' : level}_2`;
	}
	const level = [20, 30, 50, 60, 80, 90, 100].findIndex(level => batteryLevel <= level / 100);
	return `battery_android_frame_${level === 6 ? 'full' : level + 1}`;
};

export const BatteryIcon = ({batteryLevel, isCharging}) => (
	<Icon
		icon={getBatteryIcon(batteryLevel, isCharging)}
		color={isCharging ? 'var(--accent)' : batteryLevel <= 0.2 ? 'var(--error)' : undefined}
	/>
);
