import React, { Fragment } from 'react';
import { Meteor } from 'meteor/meteor';
import { createRoot } from 'react-dom/client';
import { Stack } from 'meteor/poon-router';
import { PoonOverlays } from './PoonOverlays';
import { MeteorIndicator } from './MeteorIndicator';

const App = () => (
	<Fragment>
		<Stack mode="stack"/>
		<PoonOverlays/>
		<MeteorIndicator/>
		{/*<div id="context-menu" className="dropdown-content visible"/>*/}
	</Fragment>
);

Meteor.startup(() => {
	createRoot(document.body).render(<App/>);
});
