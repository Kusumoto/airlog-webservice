var format = require('sprintf-js');
var loggers = require('../models/logger_model').Logger;
var applications = require('../models/application_model').App;
var functions = require('../models/function_model').Func;
var Joi = require('joi');

module.exports = [{
    method: 'POST',
    path: '/AgentLogger',
    handler: function(request, reply) {
        var today = new Date();
        var fulldate = format.sprintf('%04d-%02d-%02d', today.getFullYear(), (today.getMonth() + 1), today.getDate());
        var fulltime = format.sprintf('%02d:%02d:%02d', today.getHours(), today.getMinutes(), today.getSeconds());
        var ip = request.headers['x-forwarded-for'] || request.info.remoteAddress;

        applications.findOne({ 'application_token': request.payload.appToken }, function(err, app) {
            if (err) throw err;
            if (app.application_name === undefined) {
                reply({ 'status': 'failed' });
            } else if (app.application_agent === 'disable') {
                reply({ 'status': 'agent disabled!' })
            } else {
                functions.findOne({ 'application_id': app._id, 'function_token': request.payload.funcToken }, function(err, func) {
                    if (err) throw err;

                    if (func === undefined || func === null) {
                        functions.create({
                            'function_name': request.payload.funcToken,
                            'function_token': request.payload.funcToken,
                            'application_id': app._id,
                            'application_name': app.application_name,
                            'function_primary': 'true'
                        }, function(err, doc) {
                            if (err) {
                                reply({ 'status': 'failed' });
                                throw err;
                            }

                            functions.findOne({ 'application_id': app._id, 'function_token': request.payload.funcToken }, function(err, func) {
                                if (err) throw err;
                                loggers.create({
                                    'log_type': request.payload.logtype,
                                    'log_data': request.payload.logData,
                                    'log_date': fulldate,
                                    'log_time': fulltime,
                                    'log_datetime': today.toISOString(),
                                    'log_ip': ip,
                                    'log_vagent': request.payload.vagent,
                                    'log_appname': app.application_name,
                                    'log_appid': app._id,
                                    'log_funcname': func.function_name,
                                    'log_funcid': func._id,
                                    'log_classname': '',
                                    'log_methodname': ''
                                }, function(err, doc) {
                                    if (err) {
                                        reply({ 'status': 'failed' });
                                        throw err;
                                    } else {
                                        reply({ 'status': 'successful' });
                                        console.log("%s : %s,%s log insert successful.", new Date(), app.application_name, func.function_name);
                                    }
                                });
                            });
                        });
                    } else {
                        loggers.create({
                            'log_type': request.payload.logtype,
                            'log_data': request.payload.logData,
                            'log_date': fulldate,
                            'log_time': fulltime,
                            'log_datetime': today.toISOString(),
                            'log_ip': ip,
                            'log_vagent': request.payload.vagent,
                            'log_appname': app.application_name,
                            'log_appid': app._id,
                            'log_funcname': func.function_name,
                            'log_funcid': func._id,
                            'log_classname': '',
                            'log_methodname': ''
                        }, function(err, doc) {
                            if (err) {
                                reply({ 'status': 'failed' });
                                throw err;
                            } else {
                                reply({ 'status': 'successful' });
                                console.log("%s : %s,%s log insert successful.", new Date(), app.application_name, func.function_name);
                            }
                        });
                    }

                });
            }
        });
    }, config: {
        validate: {
            payload: {
                appToken: Joi.string(),
                funcToken: Joi.string(),
                logtype: Joi.string(),
                logData: Joi.string(),
                vagent: Joi.string()
            }
        }
    }
}]