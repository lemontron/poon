import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { ViewPagerContext } from './ViewPagerContext';

export const HeaderSecondaryContext = createContext([null, undefined]);

export const HeaderSecondaryProvider = ({children}) => {
	const target = useState(null);
	return <HeaderSecondaryContext.Provider value={target} children={children}/>;
};

export const HeaderSecondary = ({children}) => {
	const [target] = useContext(HeaderSecondaryContext);
	const pager = useContext(ViewPagerContext);
	if (pager && pager.pageIndex !== pager.currentPage) return null;
	return target && createPortal(children, target);
};
