
# Notify My Android from node.js

[Notify My Android](http://notifymyandroid.com) is a push message service and app for Android phones. This module provides easy to use methods for communicating with its API, allowing you to send notifications to your (or someone else's) Android phone from node.js.

node-notifymyandroid respects the API's rate limiting and manages this automagically, so you don't have to do anything! When the rate limit is reached, an error will be triggered.

## Installation

	npm install node-notifymyandroid
	
## Super Simple Examples

The Notify My Android API provides 2 endpoints; one for checking the validation of an API key and one to send a notification.

### Example to check if the provided API key is valid

```js
var Notifier = require('node-notifymyandroid').Notifier;
var notifier = new Notifier('Application Name', 'Your 48 bytes long NMA API key');

notifier.isValidKey(function(err, valid) {
	if(err) return console.log(err);
	console.log('Is this key valid? %s', (valid) ? 'Yes' : 'No');
});
```

### Example of how to send a notification

```js
var Notifier = require('node-notifymyandroid').Notifier;
var notifier = new Notifier('Application Name', 'Your 48 bytes long NMA API key');

// All options are optional
var options = {
	'priority': 2, // The priority of the notification (-2 to 2, default is 0)
	'url': 'http://github.com/MichielvdVelde/node-notifymyandroid' // The URL to include
}
notifier.sendNotification('Title here', 'This is the body of the notification', options, function(err) {
	if(err) return console.log(err);
	console.log('Message sent. %d calls remaining in the next %d minutes', notifier.getRemainingCalls(), notifier.getRemainingTime());
});
```

## License

Copyright 2015 Michiel van der Velde.

Licenced under the [MIT License](https://github.com/MichielvdVelde/node-notifymyandroid/blob/master/LICENSE).