import { Meteor } from 'meteor/meteor';
import { toast } from './overlays/Toast';
import { showAlert } from './overlays/Alert';
import { globalLoading } from './overlays/GlobalLoading';

export const callMethod = async (methodName, opts = {}) => {
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
		const res = await Meteor.callAsync(methodName, opts.data);
		if (opts.onSuccess) opts.onSuccess(res);
		return res;
	} catch (err) {
		console.warn(`[${methodName}]`, err.toString());
		if (opts.onError) opts.onError(err);
		toast(err.reason);
	} finally {
		if (opts.onLoading) opts.onLoading(false);
		if (opts.statusMessage) globalLoading(opts.statusMessage, false);
	}
};
