import React, { useEffect, useRef, useState } from 'react';
import { Keyboard } from '../Keyboard';
import { AnimatedValue } from '../util/animated';

const selector = '[data-virtual-keyboard="custom"]';

const keyboardPan = new AnimatedValue(1);

export const CustomKeyboard = () => {
	const el = useRef();
	const [show, setShow] = useState(false);
	const [input, setInput] = useState();
	const inputRef = useRef();
	inputRef.current = input;

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

	if (show) return (
		<div className="keyboard-overlay" ref={el}>
			<Keyboard key={Boolean(input)} inputRef={inputRef}/>
		</div>
	);
};
