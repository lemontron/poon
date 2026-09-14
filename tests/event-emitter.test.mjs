import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { test } from 'node:test';

const module = new vm.SourceTextModule(await readFile(new URL('../EventEmitter.js', import.meta.url), 'utf8'));
await module.link(() => {});
await module.evaluate();
const {EventEmitter} = module.namespace;

test('listeners receive arguments and emitter context; removal releases registrations', () => {
	const emitter = new EventEmitter();
	const calls = [];
	const callback = function(...args) { calls.push([this, args]); };
	emitter.on('message', callback).emit('message', 'hello', 3);
	assert.deepEqual(calls, [[emitter, ['hello', 3]]]);
	emitter.off('message', callback);
	assert.equal(emitter.emit('message'), false);
	emitter.on('a', callback).on('b', callback).removeAllListeners('a');
	assert.equal(emitter.emit('a'), false);
	emitter.removeAllListeners();
	assert.equal(emitter.emit('b'), false);
});

test('once is removable by its original callback and fires once under recursive emission', () => {
	const emitter = new EventEmitter();
	let calls = 0;
	const callback = () => calls++;
	emitter.once('cancelled', callback).off('cancelled', callback);
	assert.equal(emitter.emit('cancelled'), false);
	let nested = false;
	emitter.on('event', () => {
		if (nested) return;
		nested = true;
		emitter.emit('event');
	});
	emitter.once('event', callback);
	emitter.emit('event');
	assert.equal(calls, 1);
});

test('listener changes during emission apply to subsequent emissions', () => {
	const emitter = new EventEmitter();
	const calls = [];
	const second = () => calls.push('second');
	const third = () => calls.push('third');
	emitter.once('event', () => {
		calls.push('first');
		emitter.off('event', second).on('event', third);
	});
	emitter.on('event', second);
	emitter.emit('event');
	emitter.emit('event');
	assert.deepEqual(calls, ['first', 'second', 'third']);
});
