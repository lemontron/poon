import React, { createElement, useEffect, useLayoutEffect, useRef } from 'react';
import { Icon } from './Icon';
import { Touchable } from './Touchable';
import { ActivityIndicator } from './ActivityIndicator';
import { c } from './util';

const autoCompleteMap = {code: 'one-time-code', password: 'current-password'};
const typeMap = {phone: 'tel', code: 'tel', price: 'numeric'};
const placeholderMap = {search: 'Search'};
const inputModeMap = {custom: 'none', none: 'none'};
const defaultPhoneCountry = {prefix: '+1', example: '(XXX) XXX-XXXX'};

const phoneDigits = (value, country) => {
	let digits = value.replace(/\D/g, '');
	const prefix = country.prefix.slice(1);
	const length = country.example.match(/X/g).length;
	if (digits.startsWith(prefix) && (value.trim().startsWith('+') || digits.length > length)) {
		digits = digits.slice(prefix.length);
	}
	return digits.slice(0, length);
};

const formatPhone = (digits, country) => {
	let formatted = '';
	let index = 0;
	for (const char of country.example) {
		if (index === digits.length) break;
		formatted += char === 'X' ? digits[index++] : char;
	}
	return formatted;
};

const applyTitleCase = (value) => {
	if (!value) return '';
	return value.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export const TextInput = ({
	placeholder,
	value = '',
	autoComplete,
	icon,
	LeftComponent,
	type = 'text',
	dnt,
	disabled,
	rows = 0,
	className,
	onFocus,
	onBlur,
	onClick,
	maxLength,
	id,
	onChangeText = () => null,
	autoFocus,
	loading,
	RightComponent,
	countryCode,
	lowerCase,
	min,
	max,
	onPressCountry,
	countries,
	titleCase,
	frame,
	units,
	autoExpand,
	fullWidth,
	virtualKeyboard,
	ref,
}) => {
	const isTextarea = (type === 'textarea' || rows);
	const localRef = useRef();
	const inputRef = ref || localRef;
	const selectionRef = useRef();
	const gesture = useRef({}).current;
	const phoneCountry = type === 'phone' && (countryCode ? countries.find(r => r.code === countryCode) : defaultPhoneCountry);
	const internationalRef = useRef(type === 'phone' && value.startsWith('+') && !value.startsWith(phoneCountry.prefix));

	useLayoutEffect(() => {
		const selection = selectionRef.current;
		if (!selection) return;
		if (typeof document === 'undefined') return;
		if (document.activeElement !== selection.el) {
			selectionRef.current = null;
			return;
		}
		if (selection.el.value !== selection.value) return;
		selectionRef.current = null;
		selection.el.setSelectionRange(selection.start, selection.end);
	});

	useEffect(() => {
		if (!isTextarea || !autoExpand || !inputRef.current) return;
		inputRef.current.style.height = 'auto';
		inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
	}, [isTextarea, autoExpand, value]);

	const renderInput = () => {
		const changeText = (e) => {
			let text = e.target.value;

			if (isTextarea && autoExpand) {
				e.target.style.height = 'auto';
				e.target.style.height = `${e.target.scrollHeight}px`;
			}

			if (type === 'phone' && text.startsWith('+')) {
				internationalRef.current = true;
				text = '+' + text.replace(/\D/g, '').slice(0, Math.min(maxLength ?? 15, 15));
			} else if (type === 'phone') {
				internationalRef.current = false;
				let digits = phoneDigits(text, phoneCountry);
				let start = phoneDigits(text.slice(0, e.target.selectionStart), phoneCountry).length;
				let end = phoneDigits(text.slice(0, e.target.selectionEnd), phoneCountry).length;
				const inputType = e.nativeEvent.inputType;
				if (digits === phoneDigits(value, phoneCountry)) {
					if (inputType === 'deleteContentBackward' && start) {
						digits = digits.slice(0, start - 1) + digits.slice(start);
						start--;
						end = start;
					} else if (inputType === 'deleteContentForward') {
						digits = digits.slice(0, start) + digits.slice(start + 1);
						end = start;
					}
				}
				if (maxLength) digits = digits.slice(0, maxLength);
				const formatted = formatPhone(digits, phoneCountry);
				start = formatPhone(digits.slice(0, start), phoneCountry).length;
				end = formatPhone(digits.slice(0, end), phoneCountry).length;
				selectionRef.current = {el: e.target, value: formatted, start, end};
				e.target.value = formatted;
				e.target.setSelectionRange(start, end);
				text = digits ? phoneCountry.prefix + digits : '';
			} else if (type === 'number' || type === 'price') {
				text = text.replace(/[^0-9.]/g, '');
			} else {
				if (titleCase) text = applyTitleCase(text);
				if (lowerCase) text = text.toLowerCase();
				if (maxLength) text = text.slice(0, maxLength);
				if (type === 'username') text = text.replace(/\s/g, '');
			}
			if (type !== 'phone' && titleCase && e.target.setSelectionRange && e.target.selectionStart !== null) {
				const end = text.length;
				selectionRef.current = {
					el: e.target,
					value: text,
					start: Math.min(e.target.selectionStart, end),
					end: Math.min(e.target.selectionEnd, end),
				};
			}
			onChangeText(text);
		};

		const canScroll = (el, deltaY) => {
			const max = el.scrollHeight - el.clientHeight;
			if (max <= 0) return false;
			if (deltaY < 0) return el.scrollTop > 0;
			if (deltaY > 0) return el.scrollTop < max;
			return true;
		};

		return createElement(isTextarea ? 'textarea' : 'input', {
			'type': typeMap[type] || type,
			'autoComplete': autoComplete || autoCompleteMap[type],
			'maxLength': type === 'phone' ? undefined : maxLength,
			'className': c('text', disabled && 'disabled', dnt && 'dnt', className, frame && 'frame', isTextarea && autoExpand && 'auto-expand'),
			'readOnly': disabled,
			'onChange': changeText,
			'value': type === 'phone' && !internationalRef.current ? formatPhone(phoneDigits(value, phoneCountry), phoneCountry) : value,
			'autoCapitalize': (lowerCase || type === 'email' || type === 'password') ? 'none' : undefined,
			'autoCorrect': (type === 'email' || type === 'password' || lowerCase) ? 'off' : undefined,
			'spellCheck': !(type === 'email' || type === 'password' || lowerCase),
			'placeholder': placeholderMap[type] || placeholder,
			rows,
			onFocus,
			onBlur,
			onClick,
			id,
			autoFocus,
			ref: isTextarea && autoExpand ? inputRef : ref,
			min,
			max,
			'onPointerDown': isTextarea ? e => {
				gesture.y = e.clientY;
			} : undefined,
			'onPointerMove': isTextarea ? e => {
				const deltaY = gesture.y - e.clientY;
				gesture.y = e.clientY;
				if (canScroll(e.currentTarget, deltaY)) e.stopPropagation();
			} : undefined,
			'onWheel': isTextarea ? e => {
				if (canScroll(e.currentTarget, e.deltaY)) e.stopPropagation();
			} : undefined,
			'inputMode': inputModeMap[virtualKeyboard],
			'data-virtual-keyboard': !disabled && virtualKeyboard,
		});
	};

	const renderIcon = () => {
		if (LeftComponent) return LeftComponent;
		if (icon) return <Icon className="text-input-icon" icon={icon}/>;
		if (type === 'username') return <span className="text-input-icon">@</span>;
		if (type === 'price') return <span className="text-input-icon">$</span>;
		if (type === 'search') return <Icon className="text-input-icon" icon="search"/>;
	};

	const renderClearButton = () => {
		if (type !== 'search') return null;
		if (value) return (
			<Touchable onClick={() => onChangeText('')}>
				<Icon icon="cancel" className="text-input-clear"/>
			</Touchable>
		);
	};

	const renderSpinner = () => {
		if (!loading) return null;
		return (
			<div className="text-input-spinner"><ActivityIndicator size={18}/></div>
		);
	};

	const renderCountryButton = () => {
		const country = countries ? countries.find(r => r.code === countryCode) : null;

		if (!country) return null; // fix me??

		return (
			<Touchable className="text-input-country" onClick={onPressCountry}>
				<span className="emoji">{country.flag}</span>
				{country.prefix}
			</Touchable>
		);
	};

	return (
		<div
			className={c('text-input', isTextarea && 'textarea-input', fullWidth && 'full-width', type === 'search' && 'search')}>
			{type === 'phone' && !internationalRef.current && renderCountryButton()}
			{renderIcon()}
			{renderInput()}
			{RightComponent}
			{units ? <span className="meta">{units}</span> : null}
			{renderSpinner()}
			{renderClearButton()}
		</div>
	);
};
