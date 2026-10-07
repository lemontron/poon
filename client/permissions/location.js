import { useEffect } from 'react';
import { DENIED, GRANTED, PermissionDef } from './util.js';
import { storage } from '../util/storage.js';
import { createBus, useBus } from '../util/bus.js';

const locationState = createBus(storage.lastLocation);

const transformLocation = e => ({
	'type': 'Point',
	'coordinates': [e.coords.longitude, e.coords.latitude],
	'properties': {
		'altitude': e.coords.altitude,
		'accuracy': e.coords.accuracy,
		'heading': e.coords.heading,
		'date': new Date(e.timestamp),
	},
});

export const gpsLocation = new PermissionDef('GPS_LOCATION', {
	async checkAsync() {
		try {
			const status = await navigator.permissions.query({'name': 'geolocation'});
			return status.state === 'granted' ? GRANTED : DENIED;
		} catch (e) {
			console.warn('Permission check failed:', e);
			return DENIED;
		}
	},
	askAsync: () => new Promise(resolve => {
		navigator.geolocation.getCurrentPosition(
			() => resolve(GRANTED),
			() => resolve(DENIED),
		);
	}),
});

let isWatching = false;
const watchLocation = () => {
	if (isWatching) return;

	isWatching = true;
	navigator.geolocation.watchPosition(e => {
		const loc = transformLocation(e);
		storage.lastLocation = loc;
		locationState.update(loc);
	}, error => {
		isWatching = false;
		console.log(error.message);
	}, {
		'maximumAge': 0,
		'enableHighAccuracy': true,
	});
};

export const useLocation = () => {
	useEffect(watchLocation, []);
	return useBus(locationState);
};
