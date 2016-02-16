module.exports = [{
    method : 'GET',
    path : '/getVersionService',
    handler: function (request, reply) {
        console.log('%s : SAMF check service version', new Date());
        reply({'API_Version' : '2.0.1', 'Status' : 'OK'})
    } 
},{
    method: 'GET',
    path: '/api/',
    handler: function (request, reply) {
        reply('SAMF API Service version 2.0.1, Please visit SAMF Control Center to connect your application.')
    }
}];