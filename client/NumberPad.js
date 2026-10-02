import React from 'react';
import { Button } from './Button.js';

export const NumberPad = ({value, onChangeText}) => {
	const pressDigit = digit => onChangeText(`${value}${digit}`);
	const backspace = () => onChangeText(value.slice(0, -1));

	return (
		<div className="number-pad">
			{['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
				<Button key={digit} title={digit} onClick={() => pressDigit(digit)} className="number-pad-key"/>
			))}
			<div/>
			<Button title="0" onClick={() => pressDigit('0')} className="number-pad-key"/>
			<Button icon="backspace" onClick={backspace} className="number-pad-key" disabled={!value}/>
		</div>
	);
};
