import React from 'react';
import { HeaderButton } from './HeaderButton';
import { Dropdown } from './Dropdown';
import { DropdownItem } from './DropdownItem';

export const SortFilterButton = ({value, disabled, options, onChange}) => {
	return (
		<Dropdown button={<HeaderButton icon="swap_vert" disabled={disabled}/>}>
			{options.options.map(option => (
				<DropdownItem
					title={option.name}
					checked={value === option._id}
					onClick={() => onChange(option._id)}
				/>
			))}
		</Dropdown>
	);
};