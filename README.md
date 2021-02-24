
# Notify My Android from Node.js
[![travis][travis-image]][travis-url]
[![npm][npm-image]][npm-url]
[![dependencies][dependencies-image]][dependencies-url]
[![devDependencies][devDependencies-image]][devDependencies-url]
[![standardjs][standardjs-image]][standardjs-url]

**Deprecated**. Notify My Android is no longer active.

[travis-image]: https://img.shields.io/travis/MichielvdVelde/node-notifymyandroid/master.svg
[travis-url]: https://travis-ci.org/MichielvdVelde/node-notifymyandroid
[npm-image]: https://img.shields.io/npm/v/node-notifymyandroid.svg
[npm-url]: https://npmjs.org/package/node-notifymyandroid
[dependencies-image]: https://david-dm.org/MichielvdVelde/node-notifymyandroid/status.svg
[dependencies-url]: https://david-dm.org/MichielvdVelde/node-notifymyandroid
[devDependencies-image]: https://david-dm.org/MichielvdVelde/node-notifymyandroid/dev-status.svg
[devDependencies-url]: https://david-dm.org/MichielvdVelde/node-notifymyandroid?type=dev
[standardjs-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standardjs-url]: http://standardjs.com/

[Notify My Android](http://notifymyandroid.com) is a push message service and app for Android phones. This module provides easy to use methods for communicating with its API, allowing you to send notifications to your (or someone else's) Android phone from node.js.

node-notifymyandroid respects the API's rate limiting and manages this automagically, so you don't have to do anything! When the rate limit is reached, an error will be emitted.

## Installation

	npm install node-notifymyandroid
	
## Super Simple Examples

The Notify My Android API provides 2 endpoints; one for checking the validation of an API key and one to send a notification.

### Example to check if the provided API key is valid

```js
var Notifier = require('node-notifymyandroid').Notifier;
var notifier = new Notifier('Application Name', 'Your developer key, if you have one. This is optional.');

notifier.isValidKey('Your 48 bytes long NMA API key' function(err, valid) {
	if (err) return console.error(err);
	console.log('Is this key valid? %s', (valid) ? 'Yes' : 'No');
});
```

### Example of how to send a notification

```js
var Notifier = require('node-notifymyandroid').Notifier;
var notifier = new Notifier('Application Name', 'Your developer key, if you have one. This is optional.');

// All options are optional
var options = {
	priority: 2, // The priority of the notification (-2 to 2, default is 0)
	url: 'http://github.com/MichielvdVelde/node-notifymyandroid', // The URL to include
	contentType: 'text/html' // To allow basic HTML tags
}
notifier.sendNotification('API keys separated by commas. Each API key is a 48 bytes hexadecimal string.', 'The event that is being notified.', 'The notification text.', options, function (err) {
	if (err) return console.error(err);
	console.log('Message sent: %d calls remaining in the next %d minutes', notifier.getRemainingCalls(), notifier.getRemainingTime());
});
```

## Changelog

* V 1.0.1
  * Fixed parse XML body error callback
* V 1.0.0
  * Rewritten code, added all currently available API options and documented functions
* V 0.1.4
  * Fixed notifier.getRemainingCalls
* V 0.1.3
  * Fixed notifier.hasCallsRemaining
* V 0.1.2
  * Now supports notifier.isValidKey('another key here', function(err, valid) { }) to check the validity of a different key than when the object was created
  * Made notifier.hasCallsRemaining() available to check if the IP address still has calls remaining (returns a boolean)

## License

Copyright 2017 Michiel van der Velde.

Licenced under the [MIT License](https://github.com/MichielvdVelde/node-notifymyandroid/blob/master/LICENSE).
