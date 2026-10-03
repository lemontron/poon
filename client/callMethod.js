import { Meteor } from 'meteor/meteor';
import { toast } from './overlays/Toast';
import { showAlert, showConfirm } from './overlays/Alert';
import { globalLoading } from './overlays/GlobalLoading';

export const callMethod = async (methodName, opts = {}, connection = Meteor) => {
	if (opts.noop) return;
	if (opts.confirm) {
		const ok = await showConfirm(opts.confirm);
		if (!ok) return;
	}

	if (opts.onLoading) opts.onLoading(true);
	if (opts.statusMessage) globalLoading(opts.statusMessage, true);
	try {
		const promise = connection.applyAsync(methodName, [opts.data], {
			returnServerResultPromise: true,
			throwStubExceptions: true,
			noRetry: opts.noRetry,
		});
		if (opts.onStub) opts.onStub(await promise.stubPromise);

		const res = await promise;
		if (opts.onSuccess) opts.onSuccess(res);
		return res;
	} catch (err) {
		console.warn(`[${methodName}]`, err.toString());
		if (opts.onError) opts.onError(err);
		toast(err.reason || err.message);
	} finally {
		if (opts.onLoading) opts.onLoading(false);
		if (opts.statusMessage) globalLoading(opts.statusMessage, false);
	}
};
