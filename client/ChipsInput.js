import React, { useState } from 'react';
import { Tag } from './Tag';
import { showAlert } from './overlays/Alert.js';

export const ChipsInput = ({
	chips = [],
	onChangeChips = () => null,
	placeholder,
}) => {
	const [value, setValue] = useState('');

	const submitChip = () => {
		const nextChip = value.trim();
		if (!nextChip) return;
		onChangeChips([...chips, nextChip]);
		setValue('');
	};

	const onKeyDown = (event) => {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		submitChip();
	};

	const onSubmit = (event) => {
		event.preventDefault();
		submitChip();
	};

	const deleteChip = async (chip) => {
		onChangeChips(chips.filter(r => r !== chip));
	};

	return (
		<div className="chips-input">
			{chips.map((chip, i) => (
				<Tag key={`${chip}-${i}`} tag={chip} onDelete={deleteChip}/>
			))}
			<form className="chips-entry" onSubmit={onSubmit}>
				<input
					className="chips-entry-input"
					type="text"
					enterKeyHint="done"
					value={value}
					placeholder={placeholder}
					onChange={(event) => setValue(event.target.value)}
					onKeyDown={onKeyDown}
				/>
			</form>
		</div>
	);
};
