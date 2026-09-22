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

## Service Worker

Poon registers and serves `/service-worker.js` for every app. The worker caches the generated Meteor shell and same-origin assets so the app can continue running offline.

Server packages can add optional worker behavior with `addServiceWorkerSource`:

```javascript
import { addServiceWorkerSource } from 'meteor/poon';

addServiceWorkerSource(Assets.getTextAsync('assets/feature-service-worker.js'));
```
