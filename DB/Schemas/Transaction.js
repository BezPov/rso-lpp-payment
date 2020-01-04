const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
	creditAccount: {
		type: mongoose.Schema.ObjectId,
		required: true
	},
	oldState: {
		type: Number,
		required: true
	},
	newState: {
		type: Number,
		required: true
	},
	transactionAmount: {
		type: Number,
		required: true
	},
	transactionType: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date
	},
	lastUpdatedAt: {
		type: Date
	}
}, { collection: 'transactions' });

module.exports = exports = mongoose.model('Transaction', TransactionSchema);