import React, { useEffect, useRef, useState } from 'react';
import { Touchable } from '../Touchable';
import { Icon } from '../Icon';
import { AnimatedValue } from '../util/animated';

const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const selector = '[data-virtual-keyboard="custom"]';

const keyboardPan = new AnimatedValue(1);

const setValue = (input, value, caret) => {
	const prototype = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value);
	if (input.selectionStart !== null) input.setSelectionRange(caret, caret);
	input.dispatchEvent(new Event('input', {bubbles: true}));
};

const Key = ({children, onClick, className = ''}) => (
	<Touchable
		className={`keyboard-key ${className}`}
		onClick={onClick}
		children={children}
	/>
);

export const CustomKeyboard = () => {
	const el = useRef();
	const [show, setShow] = useState(false);
	const [input, setInput] = useState();
	const [shift, setShift] = useState(false);

	useEffect(() => {
		keyboardPan.spring(input ? 0 : 1);
	}, [!input]);

	useEffect(() => {
		return keyboardPan.on(val => {
			if (el.current) el.current.style.transform = `translateY(${val * 100}%)`;
		});
	}, []);

	useEffect(() => {
		const focus = e => {
			setShow(true);
			setInput(e.target.matches(selector) ? e.target : undefined);
			setShift(false);
		};
		const blur = e => {
			if (e.target.matches(selector) && !e.relatedTarget?.matches(selector)) setInput();
		};

		document.addEventListener('focusin', focus);
		document.addEventListener('focusout', blur);

		if (document.activeElement.matches(selector)) {
			setShow(true);
			setInput(document.activeElement);
		}

		return () => {
			document.removeEventListener('focusin', focus);
			document.removeEventListener('focusout', blur);
		};
	}, []);

	const email = (input?.type === 'email');

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

	if (show) return (
		<div
			className="keyboard"
			onPointerDown={e => e.preventDefault()}
			ref={el}
		>
			{email && (
				<div className="keyboard-row top">
					{'1234567890'.split('').map(number => (
						<Key key={number} className="letter" onClick={() => edit(number)}>{number}</Key>
					))}
				</div>
			)}
			<div className="keyboard-row top">
				{rows[0].split('').map(letter => (
					<Key key={letter} className="letter" onClick={() => edit(shift ? letter.toUpperCase() : letter)}>
						{shift ? letter.toUpperCase() : letter}
					</Key>
				))}
			</div>
			<div className="keyboard-row middle">
				{rows[1].split('').map(letter => (
					<Key key={letter} className="letter" onClick={() => edit(shift ? letter.toUpperCase() : letter)}>
						{shift ? letter.toUpperCase() : letter}
					</Key>
				))}
			</div>
			<div className="keyboard-row bottom">
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
			<div className="keyboard-actions">
				{email ? ['@', '.', '-', '_', '+', '.com'].map(text => (
					<Key key={text} className="space" onClick={() => edit(text)}>{text}</Key>
				)) : <Key className="space" onClick={() => edit(' ')}/>}
			</div>
		</div>
	);
};
