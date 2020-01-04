const logger = require('../services/logging');

const initRoutes = function (server) {
    server.get('/etcd', function (req, res, next) {
        logger.info('Accessed etcd route');

        require('../services/etcd').get("firstValue", (err, etcdResponse) => {
            res.json(etcdResponse);

            return next();
        });
    });
};

module.exports = initRoutes;