import React, { useEffect, useState } from 'react';
import { Touchable } from '../Touchable';
import { Icon } from '../Icon';
import { toast } from './Toast';

const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const selector = '[data-virtual-keyboard="custom"]';
let audioContext;

const playClick = () => {
	audioContext ||= new AudioContext();
	audioContext.resume();
	const oscillator = audioContext.createOscillator();
	const gain = audioContext.createGain();
	const now = audioContext.currentTime;
	oscillator.type = 'square';
	oscillator.frequency.value = 600;
	gain.gain.setValueAtTime(.04, now);
	gain.gain.exponentialRampToValueAtTime(.001, now + .02);
	oscillator.connect(gain).connect(audioContext.destination);
	oscillator.start(now);
	oscillator.stop(now + .02);
};

const setValue = (input, value, caret) => {
	const prototype = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value);
	if (input.selectionStart !== null) input.setSelectionRange(caret, caret);
	input.dispatchEvent(new Event('input', {bubbles: true}));
};

const Key = ({children, onClick, className = ''}) => (
	<Touchable
		className={`custom-keyboard-key ${className}`}
		onPointerDown={playClick}
		onClick={onClick}
		children={children}
	/>
);

export const CustomKeyboard = () => {
	const [input, setInput] = useState();
	const [shift, setShift] = useState(false);

	useEffect(() => {
		const focus = e => {
			setInput(e.target.matches(selector) ? e.target : undefined);
			setShift(false);
		};
		const blur = e => {
			if (e.target.matches(selector) && !e.relatedTarget?.matches(selector)) setInput();
		};

		document.addEventListener('focusin', focus);
		document.addEventListener('focusout', blur);
		if (document.activeElement.matches(selector)) setInput(document.activeElement);
		return () => {
			document.removeEventListener('focusin', focus);
			document.removeEventListener('focusout', blur);
		};
	}, []);

	if (!input) return null;
	const email = input.type === 'email';

	const edit = text => {
		const start = input.selectionStart ?? input.value.length;
		const end = input.selectionEnd ?? input.value.length;
		setValue(input, `${input.value.slice(0, start)}${text}${input.value.slice(end)}`, start + text.length);
	};

	const backspace = () => {
		const start = input.selectionStart ?? input.value.length;
		const end = input.selectionEnd ?? input.value.length;
		const from = start === end ? Math.max(0, start - 1) : start;
		setValue(input, `${input.value.slice(0, from)}${input.value.slice(end)}`, from);
	};

	return (
		<div
			className="custom-keyboard"
			onPointerDown={e => e.preventDefault()}
		>
			{email && (
				<div className="custom-keyboard-row top">
					{'1234567890'.split('').map(number => (
						<Key key={number} className="letter" onClick={() => edit(number)}>{number}</Key>
					))}
				</div>
			)}
			<div className="custom-keyboard-row top">
				{rows[0].split('').map(letter => (
					<Key key={letter} className="letter" onClick={() => edit(shift ? letter.toUpperCase() : letter)}>
						{shift ? letter.toUpperCase() : letter}
					</Key>
				))}
			</div>
			<div className="custom-keyboard-row middle">
				{rows[1].split('').map(letter => (
					<Key key={letter} className="letter" onClick={() => edit(shift ? letter.toUpperCase() : letter)}>
						{shift ? letter.toUpperCase() : letter}
					</Key>
				))}
			</div>
			<div className="custom-keyboard-row bottom">
				<Key className={`shift ${shift ? 'active' : ''}`} onClick={() => setShift(!shift)}>
					<Icon icon="shift"/>
				</Key>
				{rows[2].split('').map(letter => (
					<Key key={letter} className="letter" onClick={() => edit(shift ? letter.toUpperCase() : letter)}>
						{shift ? letter.toUpperCase() : letter}
					</Key>
				))}
				<Key className="backspace" onClick={backspace}>
					<Icon icon="backspace"/>
				</Key>
			</div>
			<div className="custom-keyboard-actions">
				{email ? ['@', '.', '-', '_', '+', '.com'].map(text => (
					<Key key={text} className="space" onClick={() => edit(text)}>{text}</Key>
				)) : <Key className="space" onClick={() => edit(' ')}/>}
			</div>
		</div>
	);
};
