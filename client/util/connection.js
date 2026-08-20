import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

export const useConnection = () => useTracker(() => {
	const busy = Meteor.loggingIn && Meteor.loggingIn();
	if (busy) return 'connected';
	return Meteor.status().status;
}, []);