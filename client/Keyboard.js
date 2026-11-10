import React, { useEffect, useState } from 'react';
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { ActivityIndicator } from './ActivityIndicator';
import { applyTextCase } from './util/text-case';

const letterRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const symbolRows = ['1234567890', '@#$%&-+()', '*"\':;!?'];

const setValue = (input, value, caret) => {
	const prototype = input.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
	Object.getOwnPropertyDescriptor(prototype, 'value').set.call(input, value);
	if (input.selectionStart !== null) input.setSelectionRange(caret, caret);
	input.dispatchEvent(new Event('input', {bubbles: true}));
};

const Key = ({children, onClick, disabled, className = ''}) => (
	<Touchable
		className={`keyboard-key ${className}`}
		onClick={onClick}
		disabled={disabled}
		children={children}
	/>
);

export const Keyboard = ({inputRef, layout, onSubmit, submitDisabled, submitLoading}) => {
	const [shift, setShift] = useState(false);
	const [symbols, setSymbols] = useState(false);
	const [context, setContext] = useState({prefix: '', textCase: undefined});
	const input = inputRef.current;

	useEffect(() => {
		const input = inputRef.current;
		if (!input) return;
		const syncContext = () => {
			if (document.activeElement !== input) return;
			setContext({
				prefix: input.value.slice(0, input.selectionStart ?? input.value.length),
				textCase: input.dataset.textCase,
			});
		};
		syncContext();
		input.addEventListener('input', syncContext);
		input.addEventListener('focus', syncContext);
		document.addEventListener('selectionchange', syncContext);
		return () => {
			input.removeEventListener('input', syncContext);
			input.removeEventListener('focus', syncContext);
			document.removeEventListener('selectionchange', syncContext);
		};
	}, [inputRef, input]);

	const email = (input?.dataset.inputType === 'email');
	const formatKey = char => applyTextCase(context.prefix + char, context.textCase).slice(context.prefix.length);
	const uppercase = formatKey(shift ? 'Q' : 'q') === 'Q';
	const caseLocked = formatKey('q') === formatKey('Q');
	const rows = (symbols ? symbolRows : letterRows).map(row => symbols ? row : (
		row.split('').map(char => formatKey(shift ? char.toUpperCase() : char)).join('')
	));

	const edit = text => {
		const input = inputRef.current;
		const start = input.selectionStart ?? input.value.length;
		const end = input.selectionEnd ?? input.value.length;
		setValue(input, `${input.value.slice(0, start)}${text}${input.value.slice(end)}`, start + text.length);
		setShift(false);
	};

	const backspace = () => {
		const input = inputRef.current;
		const start = input.selectionStart ?? input.value.length;
		const end = input.selectionEnd ?? input.value.length;
		const from = start === end ? Math.max(0, start - 1) : start;
		setValue(input, `${input.value.slice(0, from)}${input.value.slice(end)}`, from);
	};

	return (
		<div
			className="keyboard"
			onPointerDown={e => e.preventDefault()}
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
					<Key className={`shift ${uppercase ? 'active' : ''}`} disabled={caseLocked}
						 onClick={() => setShift(!shift)}>
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
				{onSubmit ? (
					<Key className="submit fake" children="Done"/>
				) : null}
				{layout === 'name' ? (
					<Key className="punctuation" onClick={() => edit('\'')}>'</Key>
				) : (
					<Key className="mode" onClick={() => setSymbols(!symbols)}>{symbols ? 'ABC' : '?123'}</Key>
				)}
				{email && layout !== 'name' ? <Key className="punctuation" onClick={() => edit('@')}>@</Key> : null}
				<Key className="space" onClick={() => edit(' ')}><Icon icon="space_bar"/></Key>
				{layout === 'name' ? (
					<Key className="punctuation" onClick={() => edit('-')}>-</Key>
				) : (
					<Key className="punctuation" onClick={() => edit('.')}>.</Key>
				)}
				{onSubmit ? (
					<Key
						className="submit" onClick={onSubmit} disabled={submitDisabled || submitLoading}
						children="Done"
					/>
				) : null}
			</div>
		</div>
	);
};
