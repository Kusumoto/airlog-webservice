var functions = require('../models/function_model').Func;
var api = require('../models/api_model').API;
var loggers = require('../models/logger_model').Logger;
var useds = require('../models/used_model').Used;

var Joi = require('joi');

module.exports = [{
    method: 'POST',
    path: '/api/functions',
    handler: function (request, reply) {
        api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
            if (err) throw err;
            if (api != undefined || api != null) {
                if (api.api_isenable === true) {
                    functions.find({}, 'function_name application_id application_name', function (err, funcs) {
                        console.log('[%s] : access_token = %s : call /api/functions', new Date(), request.payload.access_token);
                        reply(funcs);
                    });
                } else {
                    reply({ 'statusCode': '400', 'error': 'Disable Access token.' });
                }
            } else {
                reply({ 'statusCode': '400', 'error': 'Invalid Access token.' });
            }
        })

    }, config: {
        validate: {
            payload: {
                access_token: Joi.string()
            }
        }
    }
}, {
        method: 'POST',
        path: '/api/function/{app_id}/{func_id}',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
                if (err) throw err;
                if (api != undefined || api != null) {
                    if (api.api_isenable === true) {
                        functions.findOne({ '_id': request.params.func_id, 'application_id': request.params.app_id }, 'function_name application_id application_name function_primary', function (err, func) {
                            console.log('[%s] : access_token = %s : call /api/function/%s/%s', new Date(), request.payload.access_token, request.params.app_id, request.params.func_id);
                            reply(func);
                        });
                    } else {
                        reply({ 'statusCode': '400', 'error': 'Disable Access token.' });
                    }
                } else {
                    reply({ 'statusCode': '400', 'error': 'Invalid Access token.' });
                }
            })

        }, config: {
            validate: {
                payload: {
                    access_token: Joi.string()
                },
                params: {
                    func_id: Joi.string(),
                    app_id: Joi.string()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/api/function/{app_id}/{func_id}/loggercount',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
                if (err) throw err;
                if (api != undefined || api != null) {
                    if (api.api_isenable === true) {
                        functions.findOne({ '_id': request.params.func_id, 'application_id': request.params.app_id }, function (err, func) {
                            if (err) throw err;
                            if (func != undefined || func != null) {
                                if (request.payload.start == undefined || request.payload.start == null || request.payload.end == undefined || request.payload.end == null) {
                                    loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Info', 'log_funcid': request.params.func_id }, function (err, info) {
                                        if (err) throw err;
                                        loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Debug', 'log_funcid': request.params.func_id }, function (err, debug) {
                                            if (err) throw err;
                                            loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Error', 'log_funcid': request.params.func_id }, function (err, error) {
                                                if (err) throw err;
                                                console.log('[%s] : access_token = %s : call /api/function/%s/%s/loggercount', new Date(), request.payload.access_token, request.params.app_id, request.params.func_id);
                                                reply({ 'statusCode': 200, 'application_id': func.application_id, 'application_name': func.application_name, 'function_id': func._id, 'function_name': func.function_name, 'data': { 'info': info, 'debug': debug, 'error': error } });
                                            });
                                        });
                                    });
                                } else {
                                    loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Info', 'log_funcid': request.params.func_id, 'log_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, info) {
                                        if (err) throw err;
                                        loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Debug', 'log_funcid': request.params.func_id, 'log_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, debug) {
                                            if (err) throw err;
                                            loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Error', 'log_funcid': request.params.func_id, 'log_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, error) {
                                                if (err) throw err;
                                                console.log('[%s] : access_token = %s : call /api/function/%s/%s/loggercount', new Date(), request.payload.access_token, request.params.app_id, request.params.func_id);
                                                reply({ 'statusCode': 200, 'application_id': func.application_id, 'application_name': func.application_name, 'function_id': func._id, 'function_name': func.function_name, 'data': { 'info': info, 'debug': debug, 'error': error } });
                                            });
                                        });
                                    });
                                }
                            } else {
                                reply({ 'statusCode': '400', 'error': 'Invalid application id or function id.' });
                            }
                        });
                    } else {
                        reply({ 'statusCode': '400', 'error': 'Disable Access token.' });
                    }
                } else {
                    reply({ 'statusCode': '400', 'error': 'Invalid Access token.' });
                }
            });
        }, config: {
            validate: {
                payload: {
                    access_token: Joi.string(),
                    start: Joi.string().allow(''),
                    end: Joi.string().allow('')
                },
                params: {
                    app_id: Joi.string(),
                    func_id: Joi.string()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/api/function/{app_id}/{func_id}/usercount',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
                if (err) throw err;
                if (api != undefined || api != null) {
                    if (api.api_isenable === true) {
                        functions.findOne({ '_id': request.params.func_id, 'application_id': request.params.app_id }, function (err, func) {
                            if (err) throw err;
                            if (func != undefined || func != null) {
                                if (request.payload.start == undefined || request.payload.start == null || request.payload.end == undefined || request.payload.end == null) {
                                    useds.count({ 'use_appid': request.params.app_id, 'use_funcid': request.params.func_id }, function (err, count) {
                                        console.log('[%s] : access_token = %s : call /api/function/%s/%s/usercount', new Date(), request.payload.access_token, request.params.app_id, request.params.func_id);
                                        reply({ 'statusCode': 200, 'application_id': func.appliction_id, 'application_name': func.application_name, 'function_id': func._id, 'function_name': func.function_name, 'data': { 'used': count } });
                                    });
                                } else {
                                    useds.count({ 'use_appid': request.params.app_id, 'use_funcid': request.params.func_id, 'used_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, count) {
                                        console.log('[%s] : access_token = %s : call /api/function/%s/%s/usercount', new Date(), request.payload.access_token, request.params.app_id, request.params.func_id);
                                        reply({ 'statusCode': 200, 'application_id': func.appliction_id, 'application_name': func.application_name, 'function_id': func._id, 'function_name': func.function_name, 'data': { 'used': count } });
                                    });
                                }
                            } else {
                                reply({ 'statusCode': '400', 'error': 'Invalid application id or function id.' });
                            }
                        });
                    } else {
                        reply({ 'statusCode': '400', 'error': 'Disable Access token.' });
                    }
                } else {
                    reply({ 'statusCode': '400', 'error': 'Invalid Access token.' });
                }
            });
        }, config: {
            validate: {
                payload: {
                    access_token: Joi.string(),
                    start: Joi.string().allow(''),
                    end: Joi.string().allow('')
                },
                params: {
                    app_id: Joi.string(),
                    func_id: Joi.string()
                }
            }
        }
    }
];