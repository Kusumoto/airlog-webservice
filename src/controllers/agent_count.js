var format = require('sprintf-js');
var used = require('../models/used_model').Used;
var applications = require('../models/application_model').App;
var functions = require('../models/function_model').Func;
var Joi = require('joi');

module.exports = [{
    method: 'POST',
    path: '/AgentCount',
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
                                used.create({
                                    'use_date': fulldate,
                                    'use_time': fulltime,
                                    'use_datetime': today.toISOString(),
                                    'use_ipaddr': ip,
                                    'use_appid': app._id,
                                    'use_appname': app.application_name,
                                    'use_funcid': func._id,
                                    'use_funcname': func.function_name
                                }, function(err, doc) {
                                    if (err) {
                                        reply({ 'status': 'failed' });
                                        throw err;
                                    } else {
                                        reply({ 'status': 'successful' });
                                        console.log("%s : %s,%s count insert successful.", new Date(), app.application_name, func.function_name);
                                    }
                                });
                            });
                        });
                    } else {
                        used.create({
                            'use_date': fulldate,
                            'use_time': fulltime,
                            'use_datetime': today.toISOString(),
                            'use_ipaddr': ip,
                            'use_appid': app._id,
                            'use_appname': app.application_name,
                            'use_funcid': func._id,
                            'use_funcname': func.function_name
                        }, function(err, doc) {
                            if (err) {
                                reply({ 'status': 'failed' });
                                throw err;
                            } else {
                                reply({ 'status': 'successful' });
                                console.log("%s : %s,%s count insert successful.", new Date(), app.application_name, func.function_name);
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
                funcToken: Joi.string()
            }
        }
    }
}]