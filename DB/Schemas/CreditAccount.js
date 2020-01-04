const mongoose = require('mongoose');

const CreditAccountSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.ObjectId,
		required: true,
		unique: true
	},
	value: {
		type: Number,
		required: true
	},
	createdAt: {
		type: Date
	},
	lastUpdatedAt: {
		type: Date
	}
}, { collection: 'creditAccounts' });

module.exports = exports = mongoose.model('CreditAccount', CreditAccountSchema);