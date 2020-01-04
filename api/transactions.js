'use strict'

const Transaction = require('../DB/Schemas/Transaction');
const CreditAccount = require('../DB/Schemas/CreditAccount');

module.exports = function(server) {

	/**
	 * Create new transaction
	 */
	server.post('/transaction/create', (req, res, next) => {
		const data = req.body || {};

		// validate data
		if (!data.creditAccount || !data.price || !data.type) {
			res.send(500, { 'message': 'Unable to perform new transaction. Missing required data.' });
		} else {

			CreditAccount.findById(data.creditAccount)
			.then(account => {
				if (!account) res.send(404, {'message': `Credit account with id ${req.params.userId} was not found.`});
				else {
					const currentState = account.value;

					if (data.type === 'pull' && (currentState === 0 || currentState < data.price)) {
						res.send(500, {'message': 'Transaction failed! The amount of money on the account is insufficient.'});
					} else {

						let newState = (data.type === 'pull') ? (currentState - data.price) : (currentState + data.price);

						const transactionObj = {
							creditAccount: account._id,
							oldState: currentState,
							newState: newState,
							transactionAmount: data.price,
							transactionType: data.type,
							createdAt: new Date(),
							lastUpdatedAt: new Date()
						};

						Transaction.create(transactionObj)
						.then(transaction => {
							CreditAccount.updateOne({ _id: account._id}, { value: newState })
							.then(newAccount => {

								account.value = newState;

								res.send(200, account);
								next();
							})
							.catch(err => {
								res.send(500, err);
							});
						})
						.catch(err => {
							res.send(500, err);
						});
					}
				}
			})
			.catch(err => {
				res.send(500, err);
			});
		}
	});
};