# Poon

Poon framework components and utilities for Meteor apps.

## Usage

Add the package to a Meteor app:

```bash
meteor add poon
```

Import components and helpers from the Meteor package:

```javascript
import { Button, Card, callMethod } from 'meteor/poon';
```

## Subscriptions

`useSubscribe(name, ...args)` returns a reactive readiness boolean. Calls with the
same name and EJSON-equivalent arguments share one Meteor subscription and its
readiness, including when a new component mounts after it is already ready.
Object argument key order does not affect sharing.

React's external-store subscription lifecycle acquires the shared handle and
listens to its readiness bus. Removing the last listener immediately stops the
handle and removes it from the registry. Rendering alone does not create records
or subscriptions. A full unmount/remount, including Strict Mode's development
check, starts a fresh subscription.

## Service Worker

Poon registers and serves `/service-worker.js` for every app. The worker supports optional service worker features such as push notifications, but does not cache app pages or assets.

Server packages can add optional worker behavior with `addServiceWorkerSource`:

```javascript
import { addServiceWorkerSource } from 'meteor/poon';

addServiceWorkerSource(Assets.getTextAsync('assets/feature-service-worker.js'));
```
