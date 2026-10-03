import React from 'react';
import { Button } from './Button.js';

export const NumberInput = ({
	value,
	onChangeValue,
	step = 1,
	minValue,
	maxValue,
	allowUnlimited,
	incrementOnly,
}) => {
	let currentValue = value;
	if (value === undefined) currentValue = 0;

	const minUnlimited = allowUnlimited && value !== undefined && minValue !== undefined && currentValue <= minValue;
	const maxUnlimited = allowUnlimited && value !== undefined && maxValue !== undefined && currentValue >= maxValue;

	const changeValue = (delta) => {
		if (delta < 0) {
			if (minUnlimited) return onChangeValue(undefined);
			if (value === undefined) return onChangeValue(maxValue);

			if (minValue === undefined) {
				onChangeValue(currentValue - step);
			} else {
				onChangeValue(Math.max(currentValue - step, minValue));
			}
		} else {
			if (maxUnlimited) return onChangeValue(undefined);
			if (value === undefined) return onChangeValue(minValue);

			if (maxValue === undefined) {
				onChangeValue(currentValue + step);
			} else {
				onChangeValue(Math.min(currentValue + step, maxValue));
			}
		}
	};

	return (
		<div className="number-input">
			{incrementOnly ? null : (
				<Button
					icon="remove"
					onClick={() => changeValue(-1)}
					disabled={!allowUnlimited && minValue !== undefined && currentValue <= minValue}
					active
					square
				/>
			)}
			<div className="number-input-value">{value === undefined ? '∞' : value}</div>
			<Button
				icon="add"
				onClick={() => changeValue(1)}
				disabled={!allowUnlimited && maxValue !== undefined && currentValue >= maxValue}
				active
				square
			/>
		</div>
	);
};
