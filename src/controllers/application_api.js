var applications = require('../models/application_model').App;
var functions = require('../models/function_model').Func;
var api = require('../models/api_model').API;
var loggers = require('../models/logger_model').Logger;
var useds = require('../models/used_model').Used;

var Joi = require('joi');

module.exports = [{
    method: 'POST',
    path: '/api/applications',
    handler: function (request, reply) {
        api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
            if (err) throw err;
            if (api != undefined || api != null) {
                if (api.api_isenable == true) {
                    applications.find({}, 'application_name application_lang application_agent', function (err, apps) {
                        console.log('[%s] : access_token = %s : call /api/applications', new Date(), request.payload.access_token);
                        reply(apps);
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
        path: '/api/application/{app_id}',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
                if (err) throw err;
                if (api != undefined || api != null) {
                    if (api.api_isenable == true) {
                        applications.findOne({ '_id': request.params.app_id }, 'application_name application_lang application_agent', function (err, apps) {
                            console.log('[%s] : access_token = %s : call /api/application/%s', new Date(), request.payload.access_token, request.params.app_id);
                            reply(apps);
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
                    app_id: Joi.string()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/api/application/{app_id}/listfunction',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token }, function (err, api) {
                if (err) throw err;
                if (api != undefined || api != null) {
                    if (api.api_isenable == true) {
                        functions.find({ 'application_id': request.params.app_id }, 'function_name application_id application_name function_primary', function (err, func) {
                            console.log('[%s] : access_token = %s : call /api/application/%s/listfunction', new Date(), request.payload.access_token, request.params.app_id);
                            reply(func);
                        })
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
                    access_token: Joi.string()
                },
                params: {
                    app_id: Joi.string()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/api/application/{app_id}/loggercount',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token, 'api_isenable': 'true' }, function (err, api) {
                if (err) throw err;
                if (api != undefined || api != null) {
                    if (api.api_isenable == true) {
                        applications.findOne({ '_id': request.params.app_id }, function (err, app) {
                            if (err) throw err;
                            if (app != undefined || app != null) {
                                if (request.payload.start == undefined || request.payload.start == null || request.payload.end == undefined || request.payload.end == null) {
                                    loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Info' }, function (err, info) {
                                        if (err) throw err;
                                        loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Debug' }, function (err, debug) {
                                            if (err) throw err;
                                            loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Error' }, function (err, error) {
                                                if (err) throw err;
                                                console.log('[%s] : access_token = %s : call /api/application/%s/loggercount', new Date(), request.payload.access_token, request.params.app_id);
                                                reply({ 'statusCode': 200, 'application_id': app._id, 'application_name': app.application_name, 'data': { 'info': info, 'debug': debug, 'error': error } });
                                            });
                                        });
                                    })
                                } else {
                                    loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Info', 'log_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, info) {
                                        if (err) throw err;
                                        loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Debug', 'log_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, debug) {
                                            if (err) throw err;
                                            loggers.count({ 'log_appid': request.params.app_id, 'log_type': 'Error', 'log_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, error) {
                                                if (err) throw err;
                                                console.log('[%s] : access_token = %s : call /api/application/%s/loggercount', new Date(), request.payload.access_token, request.params.app_id);
                                                reply({ 'statusCode': 200, 'application_id': app._id, 'application_name': app.application_name, 'data': { 'info': info, 'debug': debug, 'error': error } });
                                            });
                                        })
                                    })
                                }
                            } else {
                                reply({ 'statusCode': '400', 'error': 'Invalid application id.' });
                            }
                        })
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
                    app_id: Joi.string()
                }
            }
        }
    }, {
        method: 'POST',
        path: '/api/application/{app_id}/usercount',
        handler: function (request, reply) {
            api.findOne({ 'api_key': request.payload.access_token, 'api_isenable': 'true' }, function (err, api) {
                if (api != undefined || api != null) {
                    if (api.api_isenable == true) {
                        applications.findOne({ '_id': request.params.app_id }, function (err, app) {
                            if (err) throw err;
                            if (app != undefined || app != null) {
                                if (request.payload.start == undefined || request.payload.start == null || request.payload.end == undefined || request.payload.end == null) {
                                    useds.count({ 'use_appid': request.params.app_id }, function (err, count) {
                                        console.log('[%s] : access_token = %s : call /api/application/%s/usercount', new Date(), request.payload.access_token, request.params.app_id);
                                        reply({ 'statusCode': 200, 'application_id': app._id, 'application_name': app.application_name, 'data': { 'used': count } });
                                    });
                                } else {
                                    useds.count({ 'use_appid': request.params.app_id, 'used_datetime': { "$gte": new Date(request.payload.start), "$lt": new Date(request.payload.end) } }, function (err, count) {
                                        console.log('[%s] : access_token = %s : call /api/application/%s/usercount', new Date(), request.payload.access_token, request.params.app_id);
                                        reply({ 'statusCode': 200, 'application_id': app._id, 'application_name': app.application_name, 'data': { 'used': count } });
                                    });
                                }
                            } else {
                                reply({ 'statusCode': '400', 'error': 'Invalid application id.' });
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
                    app_id: Joi.string()
                }
            }
        }
    }
];