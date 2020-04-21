const mysql = require('mysql');
const defaultConfig = require('../config');

class Connection {
	constructor(config = {}) {
		/** @type {import('mysql').Connection} */
		this._connection = mysql.createConnection(Object.assign({}, defaultConfig.connection, config));
		this.inTransaction = false;
	}

	connect() {
		return new Promise((resolve, reject) => {
			this._connection.connect(err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}

	disconnect() {
		return new Promise((resolve, reject) => {
			this._connection.end(err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}

	query(sql) {
		return new Promise((resolve, reject) => {
			this._connection.query(sql, (err, rows) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			});
		})
	}

	escape(value) {
		return this._connection.escape(value);
	}

	beginTransaction() {
		return new Promise((resolve, reject) => {
			this._connection.beginTransaction(err => {
				if (err) {
					reject(err);
					return;
				}
				this.inTransaction = true;
				resolve();
			});
		});
	}

	commit() {
		return new Promise((resolve, reject) => {
			this._connection.commit(err => {
				this.inTransaction = false;
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}

	rollback() {
		return new Promise((resolve, reject) => {
			this._connection.rollback(err => {
				this.inTransaction = false;
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
}

module.exports = Connection;