import { useTracker } from 'meteor/react-meteor-data';
import { toast } from '../overlays/Toast';

export const useSubscribe = (name, ...args) => {
	return useTracker(() => {
		return Meteor.subscribe(name, ...args, {
			onStop(err) {
				if (err) toast(err.reason);
			},
		}).ready();
	}, [name, EJSON.stringify(args)], EJSON.equals);
};