import { useMemo } from 'react';
import { EJSON } from 'meteor/ejson';
import { toast } from '../overlays/Toast';
import { Bus, useBus } from './bus';

const subscriptionsRegistry = new Map();

export const useSubscribe = (...args) => {
	const key = EJSON.stringify(args, {canonical: true});
	const subscription = useMemo(() => ({
		on: listener => {
			let record = subscriptionsRegistry.get(key);
			if (!record) {
				const bus = new Bus(false);
				const handle = Meteor.subscribe(...args, {
					onReady: () => bus.update(true),
					onStop: err => {
						bus.update(false);
						if (err) toast(err.reason);
					},
				});
				record = {bus, handle};
				subscriptionsRegistry.set(key, record);
			}

			const off = record.bus.on(listener);
			return () => {
				off();
				if (record.bus.listeners.length === 0) {
					subscriptionsRegistry.delete(key);
					record.handle.stop();
				}
			};
		},
		getSnapshot: () => {
			const record = subscriptionsRegistry.get(key);
			return record ? record.bus.state : false;
		},
	}), [key]);

	return useBus(subscription);
};
