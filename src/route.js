var agent_logger = require('./controllers/agent_logger');
var agent_count = require('./controllers/agent_count');
var service_version = require('./controllers/service_version');
var application_api = require('./controllers/application_api');
var function_api = require('./controllers/function_api')
 
module.exports = [].concat(
    agent_logger,
    agent_count,
    service_version,
    application_api,
    function_api
    );