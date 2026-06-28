import { Meteor } from 'meteor/meteor';

const reconnectNow = () => {
	if (document.visibilityState !== 'visible') return;
	const {status} = Meteor.status();
	if (status !== 'connected') Meteor.reconnect();
};

window.addEventListener('focus', reconnectNow, false);
document.addEventListener('visibilitychange', reconnectNow, false);
