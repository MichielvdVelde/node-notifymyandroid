
var format = require('util').format;
var parseString = require('xml2js').parseString;
var querystring = require('querystring');
var request = require('request');

exports.ENDPOINTS = {
	'VERIFY': 'https://www.notifymyandroid.com/publicapi/verify',
	'NOTIFY': 'https://www.notifymyandroid.com/publicapi/notify'
};

var Notifier = function(applicationName, apiKey) {

	var self = this;
	var remaining = { 'calls': 1 };
	
	var processRemaining = function(calls, timer) {
		var date = new Date();
		date.setMinutes(date.getMinutes() + parseInt(timer));
		remaining = { 'calls': calls, 'resettimer': timer, 'date': date };
	};
	var hasCallsRemaining = function() {
		return remaining.calls == 0 && self.getRemainingTime() > 0;
	}
	
	this.getRemainingCalls = function() {
		return remaining.calls;
	};
	
	this.getRemainingTime = function() {
		return Math.ceil((remaining.date - (new Date()))/60000);
	};
	
	this.isValidKey = function(callback) {
	
		if(apiKey.length != 48) return callback(new Error('API key needs to be 48 bytes long'));
		if(!hasCallsRemaining()) return callback(new Error('Request limit reached. Limit will be reset within ' + remaining.resettimer + ' minutes'));
		request(format('%s?apikey=%s', exports.ENDPOINTS.VERIFY, apiKey), function(error, response, body) {
		
			if(error) return callback(error);
			if(response.statusCode != 200) return callback(new Error('Received unexpected status code: ' + response.statusCode));
			parseString(body, function (err, result) {
			
				if(error) return callback(error);
				if(result.nma.error) {
					if(result.nma.error[0]['$']['code'] == 401)
						return callback(null, false);
					return callback(new Error('API returned status code ' + result.nma.error[0]['$']['code'] + ': ' + result.nma.error[0]['_']));
				}
				processRemaining(result.nma.success[0]['$']['remaining'], result.nma.success[0]['$']['resettimer']);
				return callback(null, true);
			});
		});
	};
	
	this.sendNotification = function(title, body, options, callback) {
	
		if(!callback) {
			callback = options;
			options = {};
		}
		if(apiKey.length != 48) return callback(new Error('API key needs to be 48 bytes long'));
		if(!hasCallsRemaining()) return callback(new Error('Request limit reached. Limit will be reset within ' + remaining.resettimer + ' minutes'));
		var data = {
			'form': {
				'apikey': apiKey,
				'application': applicationName,
				'event': title,
				'description': body,
				'priority': options.priority || 0,
				'url': options.url || ''
			}
		};
		request.post(exports.ENDPOINTS.NOTIFY, data, function(error, response, body) {
		
			if(error) return callback(error);
			if(response.statusCode != 200) return callback(new Error('Received unexpected HTTP status code: ' + response.statusCode));
			parseString(body, function (err, result) {
				if(error) return callback(error);
				if(result.nma.error) return callback(new Error('API returned status code ' + result.nma.error[0]['$']['code'] + ': ' + result.nma.error[0]['_']));
				processRemaining(result.nma.success[0]['$']['remaining'], result.nma.success[0]['$']['resettimer']);
				return callback(null);
			});
		});
	};
};

exports.Notifier = Notifier;