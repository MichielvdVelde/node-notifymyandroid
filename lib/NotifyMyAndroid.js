
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
		remaining = { 'calls': calls, 'date': date };
	};
	
	this.hasCallsRemaining = function() {
		return self.getRemainingCalls() > 0;
	};
	
	this.getRemainingCalls = function() {
		return remaining.calls;
	};
	
	this.getRemainingTime = function() {
		return Math.ceil((remaining.date - (new Date()))/60000);
	};
	
	this.isValidKey = function(key, callback) {
	
		if(!callback) {
			callback = key;
			key = apiKey;
		}
		if(key.length != 48) return callback(new Error('API key needs to be 48 bytes long'));
		if(!self.hasCallsRemaining()) return callback(new Error('Request limit reached. Limit will be reset within ' + self.getRemainingTime() + ' minutes'));
		request(format('%s?apikey=%s', exports.ENDPOINTS.VERIFY, key), function(error, response, body) {
		
			if(error) return callback(error);
			if(response.statusCode != 200) return callback(new Error('Received unexpected HTTP status code: ' + response.statusCode));
			parseString(body, function (err, result) {
			
				if(error) return callback(error);
				if(result.nma.error && !result.nma.success) {
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
		if(!self.hasCallsRemaining()) return callback(new Error('Request limit reached. Limit will be reset within ' + self.getRemainingTime() + ' minutes'));
		var data = {
			'form': {
				'application': applicationName,
				'event': title,
				'description': body,
				'priority': options.priority || 0,
				'url': options.url || ''
			}
		};
		
		if(!options.apikey && !options.apikeys) data.form.apikey = apiKey;
		if(options.apikey && !options.apikeys) data.form.apikey = options.apikey;
		//if(data.form.apikey.length != 48) return callback(new Error('API key needs to be 48 bytes long'));
		request.post(exports.ENDPOINTS.NOTIFY, data, function(error, response, body) {
		
			if(error) return callback(error);
			if(response.statusCode != 200) return callback(new Error('Received unexpected HTTP status code: ' + response.statusCode));
			parseString(body, function (err, result) {
				if(error) return callback(error);
				if(result.nma.error && !result.nma.success) return callback(new Error('API returned status code ' + result.nma.error[0]['$']['code'] + ': ' + result.nma.error[0]['_']));
				processRemaining(result.nma.success[0]['$']['remaining'], result.nma.success[0]['$']['resettimer']);
				return callback(null);
			});
		});
	};
};

exports.Notifier = Notifier;