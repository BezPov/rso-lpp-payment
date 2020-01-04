const restify = require('restify');

const logger = require('./services/logging');

const etcd = require('./services/etcd');

const options = {
    name: 'lpp-payment',
    version: process.env.npm_package_version
};

const server = restify.createServer(options);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/', (req, res, next) => {
    res.json({
        name: 'lpp-payment',
        version: process.env.npm_package_version,
        description: 'Api gateway'
    });

    return next();
});

require('./routes/healthRoutes')(server);
require('./routes/metricsRoutes')(server);
require('./routes/etcdRoutes')(server);

server.listen(8080, () => {
    console.log(`${options.name} ${options.version} listening at ${server.url}`);
    
    logger.info(`${options.name} ${options.version} listening at ${server.url}`);
});