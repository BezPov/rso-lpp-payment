const restify = require('restify');
const mongoose = require('mongoose');
const corsMiddleware = require('restify-cors-middleware');

let cors = corsMiddleware({
    preflightMaxAge: 5,
    origins: ['*'],
    allowHeaders:['X-App-Version'],
    exposeHeaders:[]
});

// TODO: configuration should be moved to separate file
const dbUri = 'mongodb+srv://bezoPovi:bezpov123!@lppcluster-hjwow.azure.mongodb.net/test?retryWrites=true&w=majority';
const connectionOptions = {
    promiseLibrary: global.Promise,
    server: {
        auto_reconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    },
    config: {
        autoIndex: true
    }
};

const logger = require('./services/logging');

const etcd = require('./services/etcd');

const options = {
    name: 'lpp-payment',
    version: process.env.npm_package_version
};

const server = restify.createServer(options);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight);
server.use(cors.actual);

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
    console.log(`${server.name} listening at ${server.url}`);

    // establish connection to mongodb atlas
    mongoose.Promise = connectionOptions.promiseLibrary;
    mongoose.connect(dbUri, connectionOptions);

    const db = mongoose.connection;

    db.on('error', (err) => {
        if (err.message.code === 'ETIMEDOUT') {
            console.log(err);
            mongoose.connect(dbUri, connectionOptions);
        }
    });

    db.once('open', () => {
         console.log("Connection to mongodb established successfully");
         require('./api/accounts')(server);
    });
});