import React from 'react';
import { Button } from './Button.js';
import { TextInput } from './TextInput.js';

const digitsOnly = value => value.replace(/[^0-9]/g, '').slice(0, 10);

const formatPhone = value => {
	const digits = digitsOnly(value);
	if (digits.length < 4) return digits ? `(${digits}` : '';
	if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const PhoneInput = ({value, onChangeText, autoFocus}) => {
	const pressDigit = digit => onChangeText(digitsOnly(`${value}${digit}`));
	const backspace = () => onChangeText(value.slice(0, -1));

	return (
		<div className="phone-input">
			<TextInput
				placeholder="(555) 123-4567"
				value={formatPhone(value)}
				onChangeText={text => onChangeText(digitsOnly(text))}
				type="text"
				autoFocus={autoFocus}
			/>
			<div className="phone-input-keypad">
				{['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
					<Button key={digit} title={digit} onClick={() => pressDigit(digit)} className="phone-input-key"/>
				))}
				<div/>
				<Button title="0" onClick={() => pressDigit('0')} className="phone-input-key"/>
				<Button icon="backspace" onClick={backspace} className="phone-input-key" disabled={!value}/>
			</div>
		</div>
	);
};
