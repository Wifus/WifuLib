const mysql2 = require("mysql2");

class SQLManager{
	constructor(dbAuth){
		this.pool = mysql2.createPool(dbAuth);
	}

	query(query, variables = []){
		return new Promise((resolve, reject) => {
			this.pool.query(query, variables, function(err, rows) {
				if(err) reject(err);
				resolve(rows);
			});
		});
	}

}

module.exports = SQLManager;