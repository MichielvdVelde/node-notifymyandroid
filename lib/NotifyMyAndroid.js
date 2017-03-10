const querystring = require('querystring');
const request = require('request');
const parseString = require('xml2js').parseString;

exports.ENDPOINTS = {
	'VERIFY': 'https://www.notifymyandroid.com/publicapi/verify',
	'NOTIFY': 'https://www.notifymyandroid.com/publicapi/notify'
};

/**
 * Notifier for Notify My Android.
 * @constructor
 * @param {string} applicationName - The name of the application that is generating the call.
 * @param {string} [developerKey] - Your developer key, if you have one. This is optional.
 */
var Notifier = function (applicationName, developerKey) {
	var self = this;
	var remaining = {
		calls: null,
		date: null
	};

	var processRemaining = function (calls, timer) {
		var date = new Date();
		date.setMinutes(date.getMinutes() + parseInt(timer));

		remaining = {
			calls: parseInt(calls),
			date: date
		};
	};

	/**
	 * Checks whether any remaining calls are available before the the limit is reset.
	 * @return {bool}
	 * @public
	 */
	this.hasCallsRemaining = function () {
		return (self.getRemainingTime() || 1) > 0 && (self.getRemainingCalls() || 1) > 0;
	};

	/**
	 * Get remaining calls.
	 * @return {?number}
	 * @public
	 */
	this.getRemainingCalls = function () {
		return remaining.calls;
	};

	/**
	 * Get remaining minutes before the limit is reset.
	 * @return {?number}
	 * @public
	 */
	this.getRemainingTime = function () {
		if (remaining.date) return Math.ceil((remaining.date - (new Date())) / 60000);
		return null;
	};

	/**
	 * Checks whether the API key is valid.
 	 * @param {string} apiKey - The api key that you want to test if it is valid.
	 * @param {function(string, bool)} callback
	 * @return {bool}
	 * @public
	 */
	this.isValidKey = function (apiKey, callback) {
		// Validate arguments
		if (!apiKey || apiKey.length != 48) return callback(new Error('API key needs to be 48 bytes long'));
		if (developerKey && developerKey.length != 48) return callback(new Error('Developer key needs to be 48 bytes long'));
		if (!self.hasCallsRemaining()) return callback(new Error('Request limit reached. Limit will be reset within ' + self.getRemainingTime() + ' minutes'));

		// Query string data
		var data = {
			apikey: apiKey
		};
		if (developerKey) data.developerkey = developerKey;

		// Send request
		request(exports.ENDPOINTS.VERIFY + '?' + querystring.stringify(data), function (error, response, body) {
			// Validate response
			if (error) return callback(error);
			if (response.statusCode != 200) return callback(new Error('Received unexpected HTTP status code: ' + response.statusCode));

			// Parse XML body
			parseString(body, function (err, result) {
				if (error) return callback(error);
				if (result.nma.error && !result.nma.success) {
					if (result.nma.error[0]['$']['code'] == 401) return callback(null, false);
					return callback(new Error('API returned status code ' + result.nma.error[0]['$']['code'] + ': ' + result.nma.error[0]['_']));
				}

				processRemaining(result.nma.success[0]['$']['remaining'], result.nma.success[0]['$']['resettimer']);
				return callback(null, true);
			});
		});
	};

	/**
	 * Send a notification.
 	 * @param {string} apiKeys - API keys separated by commas. Each API key is a 48 bytes hexadecimal string. When using multiple keys, you will only get a failure respose if all of them are not valid.
	 * @param {string} event - The event that is being notified. Depending on your application, it can be a subject or a brief description.
	 * @param {string} description - The notification text. Depending on your application, it can be a body of the message or a full description.
	 * @param {object} [options]
	 * @param {number} [options.priority=0] - A priority level for this notification. This is optional and in the future will be used to change the way NMA alerts you.
	 * @param {string} [options.url] - An URL/URI can be attached to your notification. You can send URL's or URI's supported by your device. The user will be able to long-click the notification and choose to follow the attached URL/URI, launching the application that can handle it.
	 * @param {string} [options.contentType] - You can set this parameter to "text/html" while sending the notification, and the basic html tags below will be interpreted and rendered while displaying the notification: <a href="...">, <b>, <big>, <blockquote>, <br>, <cite>, <dfn>, <div align="...">, <em>, <font size="..." color="..." face="...">, <h1>, <h2>, <h3>, <h4>, <h5>, <h6>, <i>, <p>, <small>, <strike>, <strong>, <sub>, <sup>, <tt>, <u>.
	 * @param {function(Error, bool)} callback
	 * @public
	 */
	this.sendNotification = function (apiKeys, event, description, options, callback) {
		if (!callback) {
			// Make options optional
			callback = options;
			options = {};
		}

		// Validate arguments
		if (!apiKeys || apiKeys.split(',').some(function (apiKey) { return apiKey.length != 48 })) return callback(new Error('API key needs to be 48 bytes long'));

		// Validate API limits
		if (!self.hasCallsRemaining()) return callback(new Error('Request limit reached. Limit will be reset within ' + self.getRemainingTime() + ' minutes'));

		// POST data
		var data = {
			form: {
				'apikey': apiKeys,
				'application': applicationName,
				'event': event,
				'description': description,
				'priority': options.priority || 0,
				'developerkey': developerKey,
				'url': options.url,
				'content-type': options.contentType
			}
		};

		// Send request
		request.post(exports.ENDPOINTS.NOTIFY, data, function (error, response, body) {
			// Validate response
			if (error) return callback(error);
			if (response.statusCode != 200) return callback(new Error('Received unexpected HTTP status code: ' + response.statusCode));

			// Parse XML body
			parseString(body, function (err, result) {
				if (error) return callback(error);
				if (result.nma.error && !result.nma.success) return callback(new Error('API returned status code ' + result.nma.error[0]['$']['code'] + ': ' + result.nma.error[0]['_']));

				processRemaining(result.nma.success[0]['$']['remaining'], result.nma.success[0]['$']['resettimer']);
				return callback(null, true);
			});
		});
	};
};

exports.Notifier = Notifier;