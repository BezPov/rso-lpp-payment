'use strict'

const CreditAccount = require('../DB/Schemas/CreditAccount');

module.exports = function(server) {

	/**
	 * Create new credit account
	 */
	server.post('/creditAccount/create', (req, res, next) => {
		const data = req.body || {};

		// validate data
		if (!data.user || !data.cardId) {
			res.send(500, { 'message': 'Unable to create new credit account! Missing required data.' });
		} else {
			data.createdAt = new Date();
			data.lastUpdatedAt = new Date();

			// HERE API CALL TO OFFICIAL LPP BACKEND SHOULD BE PERFORMED
			// WE SIMULATE API CALL AND RETURN DEFAULT AMOUNT RESPONSE WHICH RETURNS DATA ABOUT MONEY AMOUNT ON THE CARD
			const lppAccountResponse = {
				status: 200,
				success: 'OK',
				data: {
					money: 1500, // in euro cents
					enabled: true //is account enabled
				}
			};

			if (lppAccountResponse.data && lppAccountResponse.data.enabled) {
				data.value = lppAccountResponse.data.money;

				CreditAccount.create(data)
					.then(account => {
						res.send(200, account);
						next();
					})
					.catch(err => {
						res.send(500, err);
					});

			} else {
				res.send(500, { 'message': 'Unable to create new credit account! Account is disabled.' });
			}
		}
	});

	/**
	 * Get credit account
	 */
	server.get('/creditAccount/:userId', (req, res, next) => {

		if (!req.params.userId) {
			res.send(500, {'message': 'Required parameter userId is missing.'});
		}

		CreditAccount.findOne({user: req.params.userId})
			.then(account => {
				if (!account) res.send(404, {'message': `User's ${req.params.userId} credit account was not found.`});
				else res.send(200, account);
				next();
			})
			.catch(err => {
				res.send(500, err);
			});
	});

	/**
	 * Update user's account
	 */
	server.put('/creditAccount/:userId', (req, res, next) => {

		if (!req.params.userId) {
			res.send(500, {'message': 'Required parameter userId is missing.'});
		}

		let data = req.body || {};

		CreditAccount.update({ _id: req.params.userId}, data)
			.then(account => {
				res.send(200, account);
				next();
			})
			.catch(err => {
				res.send(500, err);
			});
	});

	/**
	 * Delete user's account
	 */
	server.del('/creditAccount/:userId', (req, res, next) => {

		if (!req.params.userId) {
			res.send(500, {'message': 'Required parameter userId is missing.'});
		}

		CreditAccount.findOneAndRemove({ user: req.params.userId })
			.then(() => {
				res.send(200, { 'message': `User's ${req.params.userId} credit account has been deleted.`});
				next();
			})
			.catch(err => {
				res.send(500, err);
			});

	});
};