const mysql2 = require("mysql2");

class SQLManager{
	constructor(dbAuth){
		this.connection = mysql2.createPool(dbAuth);
	}

	async query(query, variables = []){
		const pool = this.connection;
		return new Promise((resolve, reject) => {
			pool.query(query, variables, function(err, rows) {
				if(err) reject(err);
				resolve(rows);
			});
		});
	}

}

module.exports = SQLManager;