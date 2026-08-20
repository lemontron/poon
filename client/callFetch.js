import { Meteor } from 'meteor/meteor';
import { toast } from './overlays/Toast';
import { showAlert } from './overlays/Alert';
import { globalLoading } from './overlays/GlobalLoading';

export const callFetch = async (url, opts = {}) => {
	if (opts.confirm) {
		const ok = await showAlert({'title': opts.confirm}, [
			{_id: 'cancel', name: 'Cancel'},
			{_id: 'confirm', name: 'Confirm'},
		]);
		if (ok !== 'confirm') return;
	}

	if (opts.onLoading) opts.onLoading(true);
	if (opts.statusMessage) globalLoading(opts.statusMessage, true);
	try {
		const {confirm, onLoading, statusMessage, onSuccess, onError, parse, data, ...fetchOpts} = opts;
		if (data !== undefined) {
			fetchOpts.body = JSON.stringify(data);
			fetchOpts.headers = {'Content-Type': 'application/json', ...fetchOpts.headers};
		}
		const response = await fetch(url, fetchOpts);
		const res = parse === false ? response : (parse ? await parse(response) : await response.json());
		if (!response.ok) throw new Meteor.Error('fetch', res.error || response.statusText);
		if (onSuccess) onSuccess(res);
		return res;
	} catch (err) {
		console.warn(`[${url}]`, err.toString());
		if (opts.onError) opts.onError(err);
		toast(err.reason || err.message);
	} finally {
		if (opts.onLoading) opts.onLoading(false);
		if (opts.statusMessage) globalLoading(opts.statusMessage, false);
	}
};
