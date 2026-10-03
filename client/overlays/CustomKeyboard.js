import React, { useEffect, useRef, useState } from 'react';
import { Touchable } from '../Touchable';
import { Icon } from '../Icon';
import { AnimatedValue } from '../util/animated';

const letterRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const symbolRows = ['1234567890', '@#$%&-+()', '*"\':;!?'];
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
	const [symbols, setSymbols] = useState(false);

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
			setSymbols(false);
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

	const email = (input?.dataset.inputType === 'email');
	const rows = (symbols ? symbolRows : letterRows).map(row => !symbols && shift ? row.toUpperCase() : row);

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
			<div className="keyboard-row top">
				{rows[0].split('').map(char => (
					<Key key={char} className="letter" onClick={() => edit(char)}>
						{char}
					</Key>
				))}
			</div>
			<div className="keyboard-row middle">
				{rows[1].split('').map(char => (
					<Key key={char} className="letter" onClick={() => edit(char)}>
						{char}
					</Key>
				))}
			</div>
			<div className="keyboard-row bottom">
				{symbols ? <Key className="letter" onClick={() => edit('_')}>_</Key> : (
					<Key className={`shift ${shift ? 'active' : ''}`} onClick={() => setShift(!shift)}>
						<Icon icon="shift"/>
					</Key>
				)}
				{rows[2].split('').map(char => (
					<Key key={char} className="letter" onClick={() => edit(char)}>
						{char}
					</Key>
				))}
				<Key className="backspace" onClick={backspace}>
					<Icon icon="backspace"/>
				</Key>
			</div>
			<div className="keyboard-actions">
				<Key className="mode" onClick={() => setSymbols(!symbols)}>{symbols ? 'ABC' : '?123'}</Key>
				{email ? <Key className="punctuation" onClick={() => edit('@')}>@</Key> : null}
				<Key className="space" onClick={() => edit(' ')}>Space</Key>
				<Key className="punctuation" onClick={() => edit('.')}>.</Key>
			</div>
		</div>
	);
};
