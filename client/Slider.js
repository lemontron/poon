import React from 'react';

const stopPropagation = e => e.stopPropagation();
const identity = value => value;

export const Slider = ({value, onChangeValue, minValue = 0, maxValue = 100, step = 1, disabled, showLabels, formatValue = identity}) => {
	const percent = (value - minValue) / (maxValue - minValue) * 100;
	const input = (
		<input
			type="range"
			className="slider"
			value={value}
			min={minValue}
			max={maxValue}
			step={step}
			disabled={disabled}
			onChange={e => onChangeValue(e.target.valueAsNumber)}
			onTouchStart={stopPropagation}
			onTouchMove={stopPropagation}
			onTouchEnd={stopPropagation}
			onTouchCancel={stopPropagation}
			style={{'--slider-percent': `${percent}%`}}
		/>
	);

	if (!showLabels) return input;

	return (
		<div className={`slider-container${disabled ? ' disabled' : ''}`}>
			{input}
			<div className="slider-labels">
				<span>{minValue}</span>
				<span>{formatValue(value)}</span>
				<span>{maxValue}</span>
			</div>
		</div>
	);
};
