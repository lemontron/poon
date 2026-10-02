import React from 'react';
import { NumberPad } from './NumberPad.js';
import { TextInput } from './TextInput.js';

const digitsOnly = value => value.replace(/[^0-9]/g, '').slice(0, 10);

const formatPhone = value => {
	const digits = digitsOnly(value);
	if (digits.length < 4) return digits ? `(${digits}` : '';
	if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
	return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const PhoneInput = ({value, onChangeText, autoFocus}) => (
	<div className="phone-input">
		<TextInput
			placeholder="(555) 123-4567"
			value={formatPhone(value)}
			onChangeText={text => onChangeText(digitsOnly(text))}
			type="text"
			autoFocus={autoFocus}
			virtualKeyboard="none"
		/>
		<NumberPad
			value={value}
			onChangeText={text => onChangeText(digitsOnly(text))}
		/>
	</div>
);